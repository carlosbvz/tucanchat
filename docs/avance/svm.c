#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <svm.h> // Corrected include path
#include <time.h> 

#define MAX_LINE 1024

// Struct to hold the data fields
typedef struct {
    int id;
    int gender;
    float age;
    float height;
    float weight;
    float chair_stand;
    float arm_curl;
    float six_min_walk;
    float steps;
    float trunk_flex;
    float back_scratch;
    float TUG;
    float handgrip1;
    float VO2_ml;
    float VO2peak;
    float DXA;
    float BMD;
} Data;

// Function to parse a CSV line and fill the Data struct
void parse_line(char *line, Data *data) {
    sscanf(line, "%d,%d,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f",
           &data->id, &data->gender, &data->age, &data->height, &data->weight,
           &data->chair_stand, &data->arm_curl, &data->six_min_walk, &data->steps,
           &data->trunk_flex, &data->back_scratch, &data->TUG, &data->handgrip1,
           &data->VO2_ml, &data->VO2peak, &data->DXA, &data->BMD);
}

// Function to read data from the CSV file
int read_csv(const char *filename, Data **data_array, int *count) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        printf("Unable to open file %s\n", filename);
        return 0;
    }

    char line[MAX_LINE];
    int idx = 0;

    // Skip the header line
    fgets(line, MAX_LINE, file);

    // Count the number of lines
    while (fgets(line, MAX_LINE, file)) {
        idx++;
    }

    // Allocate memory for the data array
    *data_array = (Data *)malloc(idx * sizeof(Data));

    rewind(file); // Reset the file pointer to the beginning

    // Read each line again and fill the data
    fgets(line, MAX_LINE, file); // Skip the header again
    idx = 0;
    while (fgets(line, MAX_LINE, file)) {
        parse_line(line, &(*data_array)[idx]);
        idx++;
    }

    *count = idx;

    fclose(file);

    return 1;
}

// Function to create an SVM node for new data
struct svm_node *create_svm_node(Data *new_data) {
    struct svm_node *node = (struct svm_node *)malloc(sizeof(struct svm_node) * 18); // 17 features + termination node

    node[0].index = 1;
    node[0].value = new_data->gender;

    node[1].index = 2;
    node[1].value = new_data->age;

    node[2].index = 3;
    node[2].value = new_data->height;

    node[3].index = 4;
    node[3].value = new_data->weight;

    node[4].index = 5;
    node[4].value = new_data->chair_stand;

    node[5].index = 6;
    node[5].value = new_data->arm_curl;

    node[6].index = 7;
    node[6].value = new_data->six_min_walk;

    node[7].index = 8;
    node[7].value = new_data->steps;

    node[8].index = 9;
    node[8].value = new_data->trunk_flex;

    node[9].index = 10;
    node[9].value = new_data->back_scratch;

    node[10].index = 11;
    node[10].value = new_data->TUG;

    node[11].index = 12;
    node[11].value = new_data->handgrip1;

    node[12].index = 13;
    node[12].value = new_data->VO2_ml;

    node[13].index = 14;
    node[13].value = new_data->VO2peak;

    node[14].index = 15;
    node[14].value = new_data->DXA;

    node[15].index = 16;
    node[15].value = new_data->BMD;

    // Terminate the node list
    node[16].index = -1;

    return node;
}

// Function to create SVM problem structure
struct svm_problem create_svm_problem(Data *data_array, int count) {
    struct svm_problem prob;
    prob.l = count;
    prob.y = (double *)malloc(count * sizeof(double));  // Array to store labels (osteoporosis data)
    prob.x = (struct svm_node **)malloc(count * sizeof(struct svm_node *));  // Array of feature arrays

    // Load osteoporosis data
    FILE *ost_file = fopen("ost_data.csv", "r");
    if (!ost_file) {
        printf("Unable to open file ost_data.csv\n");
        exit(1);
    }

    char line[MAX_LINE];
    int ost_idx = 0;
    while (fgets(line, MAX_LINE, ost_file)) {
        if (ost_idx >= count) {
            break;
        }
        sscanf(line, "%*d,%lf", &prob.y[ost_idx]);  // Use %lf to read a double value
        ost_idx++;
    }

    fclose(ost_file);

    // Create SVM nodes for each data point
    for (int i = 0; i < count; i++) {
        prob.x[i] = create_svm_node(&data_array[i]);
    }

    return prob;
}

#include <time.h> // Include time.h for measuring execution time

int main() {
    // Start measuring time
    clock_t start_time = clock();

    Data *data_array = NULL;
    int count = 0;

    if (!read_csv("data.csv", &data_array, &count)) {
        return 1;
    }

    // Split data into training and testing sets
    int num_train = count * 0.8; // 80% for training, 20% for testing
    struct svm_problem prob = create_svm_problem(data_array, count);

    struct svm_problem train_prob, test_prob;
    train_prob.l = num_train;
    test_prob.l = count - num_train;

    train_prob.y = (double *)malloc(num_train * sizeof(double));
    train_prob.x = (struct svm_node **)malloc(num_train * sizeof(struct svm_node *));
    test_prob.y = (double *)malloc((count - num_train) * sizeof(double));
    test_prob.x = (struct svm_node **)malloc((count - num_train) * sizeof(struct svm_node *));

    // Populate training and testing sets
    for (int i = 0; i < num_train; i++) {
        train_prob.y[i] = prob.y[i];
        train_prob.x[i] = prob.x[i];
    }
    for (int i = num_train; i < count; i++) {
        test_prob.y[i - num_train] = prob.y[i];
        test_prob.x[i - num_train] = prob.x[i];
    }

    // Set SVM parameters
    struct svm_parameter param;
    param.svm_type = C_SVC;
    param.kernel_type = RBF;
    param.degree = 3;
    param.gamma = 0.5;
    param.coef0 = 0;
    param.nu = 0.5;
    param.cache_size = 100;
    param.C = 1;
    param.eps = 1e-3;
    param.p = 0.1;
    param.shrinking = 1;
    param.probability = 0;
    param.nr_weight = 0;
    param.weight_label = NULL;
    param.weight = NULL;

    // Train SVM model
    struct svm_model *model = svm_train(&train_prob, &param);

    // Make predictions on the testing set
    int correct = 0;
    for (int i = 0; i < test_prob.l; i++) {
        double prediction = svm_predict(model, test_prob.x[i]);
        if (prediction == test_prob.y[i]) {
            correct++;
        }
    }

    // Calculate accuracy
    double accuracy = (double)correct / test_prob.l;
    printf("Accuracy: %.2f%%\n", accuracy * 100);

    // Add new data points for prediction
    Data new_data1 = {1, 1, 65.0, 160.0, 60.0, 20, 25, 550.0, 150, 10, -5, 6.0, 25, 1500, 20.0, 45.0, 1.0};
    Data new_data2 = {2, 0, 70.0, 170.0, 75.0, 15, 20, 600.0, 200, 15, -10, 7.0, 30, 1800, 25.0, 50.0, 1.2};

    struct svm_node *new_node1 = create_svm_node(&new_data1);
    struct svm_node *new_node2 = create_svm_node(&new_data2);

    // Predict for new data
    double prediction1 = svm_predict(model, new_node1);
    double prediction2 = svm_predict(model, new_node2);

    printf("Prediction for new data 1: %d\n", (int)prediction1);
    printf("Prediction for new data 2: %d\n", (int)prediction2);

    // Free memory
    svm_free_and_destroy_model(&model);
    free(train_prob.y);
    free(test_prob.y);
    for (int i = 0; i < num_train; i++) {
        free(train_prob.x[i]);
    }
    for (int i = 0; i < test_prob.l; i++) {
        free(test_prob.x[i]);
    }
    free(train_prob.x);
    free(test_prob.x);
    free(data_array);
    free(new_node1);
    free(new_node2);

    // End measuring time
    clock_t end_time = clock();

    // Calculate the elapsed time in seconds
    double time_taken = ((double)(end_time - start_time)) / CLOCKS_PER_SEC;

    // Print the time taken
    printf("Time taken: %.2f seconds\n", time_taken);

    return 0;
}

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <omp.h>

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
    int Ost; // New field for the last column
} Data;

// Function to parse a CSV line and fill the Data struct
void parse_line(char *line, Data *data) {
    sscanf(line, "%d,%d,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%d",
           &data->id, &data->gender, &data->age, &data->height, &data->weight,
           &data->chair_stand, &data->arm_curl, &data->six_min_walk, &data->steps,
           &data->trunk_flex, &data->back_scratch, &data->TUG, &data->handgrip1,
           &data->VO2_ml, &data->VO2peak, &data->DXA, &data->BMD, &data->Ost);
}

// Function to read data from the CSV file
void read_csv(const char *filename, Data **data_array, int *count) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        printf("Unable to open file %s\n", filename);
        exit(EXIT_FAILURE);
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
    if (!*data_array) {
        printf("Memory allocation failed.\n");
        exit(EXIT_FAILURE);
    }

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
}

// Function to calculate mean
float calculate_mean(float *data, int count) {
    float sum = 0.0;
    #pragma omp parallel for reduction(+:sum)
    for (int i = 0; i < count; i++) {
        sum += data[i];
    }
    return sum / count;
}

// Function to calculate standard deviation
float calculate_std(float *data, int count, float mean) {
    float sum = 0.0;
    #pragma omp parallel for reduction(+:sum)
    for (int i = 0; i < count; i++) {
        sum += (data[i] - mean) * (data[i] - mean);
    }
    return sqrt(sum / count);
}

// Function to normalize/standardize a column
void standardize_column(float *data, int count) {
    float mean = calculate_mean(data, count);
    float std = calculate_std(data, count, mean);

    #pragma omp parallel for
    for (int i = 0; i < count; i++) {
        data[i] = (data[i] - mean) / std; // Z-score normalization
    }
}

// Function to normalize the dataset
void normalize_data(Data *dataset, int count) {
    float *columns[] = {
        &dataset[0].age, &dataset[0].height, &dataset[0].weight, &dataset[0].chair_stand,
        &dataset[0].arm_curl, &dataset[0].six_min_walk, &dataset[0].steps,
        &dataset[0].trunk_flex, &dataset[0].back_scratch, &dataset[0].TUG,
        &dataset[0].handgrip1, &dataset[0].VO2_ml, &dataset[0].VO2peak,
        &dataset[0].DXA, &dataset[0].BMD
    };
    int num_columns = sizeof(columns) / sizeof(columns[0]);

    #pragma omp parallel for
    for (int j = 0; j < num_columns; j++) {
        float *column_data = (float *)malloc(count * sizeof(float));
        if (!column_data) {
            printf("Memory allocation failed.\n");
            exit(EXIT_FAILURE);
        }

        for (int i = 0; i < count; i++) {
            column_data[i] = *(columns[j] + i * sizeof(Data) / sizeof(float));
        }

        standardize_column(column_data, count);

        for (int i = 0; i < count; i++) {
            *(columns[j] + i * sizeof(Data) / sizeof(float)) = column_data[i];
        }

        free(column_data);
    }
}

// Function to write normalized data back to a CSV file
void write_normalized_data(const char *filename, Data *data_array, int count) {
    FILE *file = fopen(filename, "w");
    if (!file) {
        printf("Unable to open file %s\n", filename);
        exit(EXIT_FAILURE);
    }

    // Write the header row
    fprintf(file, "id,Gender,Age,Height,Weight,Chair_stand,Arm_curl,Six_min_walk,Steps,Trunk_flex,Back_scratch,TUG,Handgrip1,VO2_ml,VO2peak,DXA,BMD,Ost\n");

    // Write the normalized data
    for (int i = 0; i < count; i++) {
        fprintf(file, "%d,%d,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%.4f,%d\n",
                data_array[i].id, data_array[i].gender, data_array[i].age, data_array[i].height, data_array[i].weight,
                data_array[i].chair_stand, data_array[i].arm_curl, data_array[i].six_min_walk, data_array[i].steps,
                data_array[i].trunk_flex, data_array[i].back_scratch, data_array[i].TUG, data_array[i].handgrip1,
                data_array[i].VO2_ml, data_array[i].VO2peak, data_array[i].DXA, data_array[i].BMD, data_array[i].Ost);
    }

    fclose(file);
}

int main() {
    Data *data_array = NULL;
    int count = 0;

    // Read the data from the CSV file
    read_csv("./data.csv", &data_array, &count);

    // Normalize the data
    normalize_data(data_array, count);

    // Write the normalized data back to a CSV file
    write_normalized_data("./normalized_data.csv", data_array, count);

    // Free allocated memory
    free(data_array);

    printf("Data normalization complete. Output written to './normalized_data.csv'.\n");
    return 0;
}

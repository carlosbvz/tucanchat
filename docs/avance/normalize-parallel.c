#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <omp.h>

#define MAX_LINE 1024

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

void parse_line(char *line, Data *data) {
    sscanf(line, "%d,%d,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f",
           &data->id, &data->gender, &data->age, &data->height, &data->weight,
           &data->chair_stand, &data->arm_curl, &data->six_min_walk, &data->steps,
           &data->trunk_flex, &data->back_scratch, &data->TUG, &data->handgrip1,
           &data->VO2_ml, &data->VO2peak, &data->DXA, &data->BMD);
}

void read_csv(const char *filename, Data **data_array, int *count) {
    FILE *file = fopen(filename, "r");
    if (!file) {
        printf("Unable to open file %s\n", filename);
        return;
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
}

float calculate_mean(float data[], int count) {
    float sum = 0.0;
    for (int i = 0; i < count; i++) {
        sum += data[i];
    }
    return sum / count;
}

float calculate_std(float data[], int count, float mean) {
    float sum = 0.0;
    for (int i = 0; i < count; i++) {
        sum += (data[i] - mean) * (data[i] - mean);
    }
    return sqrt(sum / count);
}

void standardize_array(float data[], int count) {
    float mean = calculate_mean(data, count);
    float std = calculate_std(data, count, mean);
    #pragma omp parallel for
    for (int i = 0; i < count; i++) {
        data[i] = (data[i] - mean) / std;
    }
}

void write_normalized_data(const char *filename, Data *data_array, int count) {
    FILE *file = fopen(filename, "w");
    if (!file) {
        printf("Unable to open file %s\n", filename);
        return;
    }

    // Write the header row
    fprintf(file, "id,Gender,Age,Height,Weight,Chair_stand,Arm_curl,Six_min_walk,Steps,Trunk_flex,Back_scratch,TUG,Handgrip1,VO2_ml,VO2peak,DXA,BMD\n");

    // Write the normalized data
    for (int i = 0; i < count; i++) {
        fprintf(file, "%d,%d,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f\n",
                data_array[i].id, data_array[i].gender, data_array[i].age, data_array[i].height, data_array[i].weight,
                data_array[i].chair_stand, data_array[i].arm_curl, data_array[i].six_min_walk, data_array[i].steps,
                data_array[i].trunk_flex, data_array[i].back_scratch, data_array[i].TUG, data_array[i].handgrip1,
                data_array[i].VO2_ml, data_array[i].VO2peak, data_array[i].DXA, data_array[i].BMD);
    }

    fclose(file);
}

int main() {
    Data *data_array = NULL;
    int count = 0;

    read_csv("data.csv", &data_array, &count);

    // Allocate memory for the arrays based on the count
    float *ages = (float *)malloc(count * sizeof(float));
    float *heights = (float *)malloc(count * sizeof(float));
    float *weights = (float *)malloc(count * sizeof(float));
    float *chair_stands = (float *)malloc(count * sizeof(float));
    float *arm_curls = (float *)malloc(count * sizeof(float));
    float *six_min_walks = (float *)malloc(count * sizeof(float));
    float *steps = (float *)malloc(count * sizeof(float));
    float *trunk_flexes = (float *)malloc(count * sizeof(float));
    float *back_scratch = (float *)malloc(count * sizeof(float));
    float *TUGs = (float *)malloc(count * sizeof(float));
    float *handgrips = (float *)malloc(count * sizeof(float));
    float *VO2_mls = (float *)malloc(count * sizeof(float));
    float *VO2peaks = (float *)malloc(count * sizeof(float));
    float *DXAs = (float *)malloc(count * sizeof(float));
    float *BMDs = (float *)malloc(count * sizeof(float));

    // Fill arrays
    for (int i = 0; i < count; i++) {
        ages[i] = data_array[i].age;
        heights[i] = data_array[i].height;
        weights[i] = data_array[i].weight;
        chair_stands[i] = data_array[i].chair_stand;
        arm_curls[i] = data_array[i].arm_curl;
        six_min_walks[i] = data_array[i].six_min_walk;
        steps[i] = data_array[i].steps;
        trunk_flexes[i] = data_array[i].trunk_flex;
        back_scratch[i] = data_array[i].back_scratch;
        TUGs[i] = data_array[i].TUG;
        handgrips[i] = data_array[i].handgrip1;
        VO2_mls[i] = data_array[i].VO2_ml;
        VO2peaks[i] = data_array[i].VO2peak;
        DXAs[i] = data_array[i].DXA;
        BMDs[i] = data_array[i].BMD;
    }

    // Standardize all data fields using a loop
    standardize_array(ages, count);
    standardize_array(heights, count);
    standardize_array(weights, count);
    standardize_array(chair_stands, count);
    standardize_array(arm_curls, count);
    standardize_array(six_min_walks, count);
    standardize_array(steps, count);
    standardize_array(trunk_flexes, count);
    standardize_array(back_scratch, count);
    standardize_array(TUGs, count);
    standardize_array(handgrips, count);
    standardize_array(VO2_mls, count);
    standardize_array(VO2peaks, count);
    standardize_array(DXAs, count);
    standardize_array(BMDs, count);

    // Write the normalized data to a CSV file
    write_normalized_data("normalized.csv", data_array, count);

    // Free allocated memory
    free(data_array);
    free(ages);
    free(heights);
    free(weights);
    free(chair_stands);
    free(arm_curls);
    free(six_min_walks);
    free(steps);
    free(trunk_flexes);
    free(back_scratch);
    free(TUGs);
    free(handgrips);
    free(VO2_mls);
    free(VO2peaks);
    free(DXAs);
    free(BMDs);

    return 0;
}
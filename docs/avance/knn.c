#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <omp.h> // Include OpenMP header

#define MAX_LINE 1024
#define K 3 // Number of neighbors

typedef struct
{
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
  int Ost; // Label for classification
} Data;

// Function to parse a CSV line and fill the Data struct
void parse_line(char *line, Data *data)
{
  sscanf(line, "%d,%d,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%d",
         &data->id, &data->gender, &data->age, &data->height, &data->weight,
         &data->chair_stand, &data->arm_curl, &data->six_min_walk, &data->steps,
         &data->trunk_flex, &data->back_scratch, &data->TUG, &data->handgrip1,
         &data->VO2_ml, &data->VO2peak, &data->DXA, &data->BMD, &data->Ost);
}

// Function to read normalized data from the CSV file
int read_normalized_data(const char *filename, Data **data_array)
{
  FILE *file = fopen(filename, "r");
  if (!file)
  {
    printf("Unable to open file %s\n", filename);
    return 0;
  }

  char line[MAX_LINE];
  int idx = 0;

  // Skip the header line
  fgets(line, MAX_LINE, file);

  // Count the number of lines
  while (fgets(line, MAX_LINE, file))
  {
    idx++;
  }

  // Allocate memory for the data array
  *data_array = (Data *)malloc(idx * sizeof(Data));
  if (!*data_array)
  {
    printf("Memory allocation failed.\n");
    exit(EXIT_FAILURE);
  }

  rewind(file);                // Reset the file pointer to the beginning
  fgets(line, MAX_LINE, file); // Skip the header again
  idx = 0;

  // Read each line and fill the data
  while (fgets(line, MAX_LINE, file))
  {
    parse_line(line, &(*data_array)[idx]);
    idx++;
  }

  fclose(file);
  return idx; // Return the number of records read
}

// Function to calculate Euclidean distance
float euclidean_distance(Data a, Data b)
{
  return sqrt(pow(a.age - b.age, 2) +
              pow(a.height - b.height, 2) +
              pow(a.weight - b.weight, 2) +
              pow(a.chair_stand - b.chair_stand, 2) +
              pow(a.arm_curl - b.arm_curl, 2) +
              pow(a.six_min_walk - b.six_min_walk, 2) +
              pow(a.steps - b.steps, 2) +
              pow(a.trunk_flex - b.trunk_flex, 2) +
              pow(a.back_scratch - b.back_scratch, 2) +
              pow(a.TUG - b.TUG, 2) +
              pow(a.handgrip1 - b.handgrip1, 2) +
              pow(a.VO2_ml - b.VO2_ml, 2) +
              pow(a.VO2peak - b.VO2peak, 2) +
              pow(a.DXA - b.DXA, 2) +
              pow(a.BMD - b.BMD, 2) +
              (a.gender != b.gender ? 1 : 0));
}

// Function to perform KNN classification
int knn_predict(Data *data_array, int count, Data new_data)
{
  float distances[count];
  int labels[count];

// Calculate distances from the new data point to all other points in parallel
#pragma omp parallel for
  for (int i = 0; i < count; i++)
  {
    distances[i] = euclidean_distance(data_array[i], new_data);
    labels[i] = data_array[i].Ost; // Store the label
  }

// Sort distances and get the labels of the K nearest neighbors
// Parallelize the sorting using OpenMP
#pragma omp parallel
  {
    for (int i = 0; i < count - 1; i++)
    {
#pragma omp for
      for (int j = 0; j < count - i - 1; j++)
      {
        if (distances[j] > distances[j + 1])
        {
          // Swap distances
          float temp_dist = distances[j];
          distances[j] = distances[j + 1];
          distances[j + 1] = temp_dist;

          // Swap labels
          int temp_label = labels[j];
          labels[j] = labels[j + 1];
          labels[j + 1] = temp_label;
        }
      }
    }
  }

  // Count the votes for each class
  int count_ost = 0;
  int count_non_ost = 0;

#pragma omp parallel
  {
    int local_count_ost = 0;     // Local count for ost votes
    int local_count_non_ost = 0; // Local count for non-ost votes

#pragma omp for
    for (int i = 0; i < K; i++)
    {
      if (labels[i] == 1)
      {
        local_count_ost++;
      }
      else
      {
        local_count_non_ost++;
      }
    }

// Update the global counts in a critical section
#pragma omp critical
    {
      count_ost += local_count_ost;
      count_non_ost += local_count_non_ost;
    }
  }

  // Return the predicted class based on majority vote
  return (count_ost > count_non_ost) ? 1 : 0;
}

// Function to read a single Data point from a file
int read_new_data(const char *filename, Data *new_data)
{
  FILE *file = fopen(filename, "r");
  if (!file)
  {
    printf("Unable to open file %s\n", filename);
    return 0;
  }

  char line[MAX_LINE];
  if (fgets(line, MAX_LINE, file))
  {
    parse_line(line, new_data); // Use existing parse_line function
  }

  fclose(file);
  return 1; // Return success
}

int main()
{
  omp_set_num_threads(16);                      // Set the number of threads
  printf("Number of threads set to: %d\n", 16); // Confirm the set value

  int num_threads = omp_get_max_threads();                          // Get the maximum number of threads available
  printf("Maximum number of threads available: %d\n", num_threads); // Check the maximum threads

  Data *data_array = NULL;
  int count = read_normalized_data("./normalized.csv", &data_array);
  if (count == 0)
  {
    return 1; // Exit if no data was read
  }

  Data new_data;
  if (!read_new_data("./patiente.csv", &new_data)) // Read new data from file
  {
    return 1; // Exit if no data was read
  }

  // Predict the class for the new data point
  int prediction = knn_predict(data_array, count, new_data);
  printf("Predicted class: %d\n", prediction);

  // Free allocated memory
  free(data_array);
  return 0;
}

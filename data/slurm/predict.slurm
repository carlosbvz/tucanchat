#!/bin/bash
#SBATCH --job-name=openmp
#SBATCH --output=predict-results.txt
#SBATCH --partition=nu-wide
#SBATCH --ntasks=16
#SBATCH --time=00:05:00

cd $SLURM_SUBMIT_DIR

module load gcc/11.1.0

export OMP_NUM_THREADS=8

./knn


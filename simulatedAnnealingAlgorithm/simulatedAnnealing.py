import random
import math
import numpy as np

# Update the preference matrix based on the preferences
# Positive values indicate a preference to work together, and negative values indicate a preference not to work together
preference_list = [
    (0, 1, 5),  # Person 0 and person 1 have a preference of 5 to work together
    (2, 3, -3), # Person 2 and person 3 have a preference of -3 (do not want to work together)
    # Add more preferences here
]

# Update the experience matrix based on the experience data
experience_list = [
    (0, 5),  # Person 0 has experience of 5
    (1, 4),  # Person 1 has experience of 4
    # Add more experience here
]

# Update the unavailability matrix based on the unavailability data
unavailability_list= [
    (0, 2),  # Person 0 is unavailable for shift 2
    (1, 4),  # Person 1 is unavailable for shift 4
    # Add more unavailability data here
]

# Update the off-day matrix based on the off-day data
offDay_list= [
    (0, 2),  # Person 0 is unavailable for shift 2
    (1, 4),  # Person 1 is unavailable for shift 4
    # Add more unavailability data here
]


unavailabilityFactor = 100
offDayFactor = 20

shifts = 28  # number of shifts
num_people = 74   # number of people
number_of_shifts = 6  # number of shifts per person
min_people_per_shift = 6
max_people_per_shift = 8
initial_temperature = 1000
cooling_rate = 0.95

def generate_initial_solution(x, y, min_people_per_shift, max_people_per_shift):
    solution = [set(random.sample(range(y), random.randint(min_people_per_shift, max_people_per_shift))) for _ in range(x)]
    print(solution)
    return solution



def get_neighbor(solution, y, min_people_per_shift, max_people_per_shift):
    new_solution = solution.copy()
    index = random.randint(0, len(solution) - 1)
    # Generate a new set of people for the selected shift
    new_people = set(random.sample(range(y), random.randint(min_people_per_shift, max_people_per_shift)))
    new_solution[index] = new_people
    return new_solution


def acceptance_probability(old_cost, new_cost, temperature):
    if new_cost < old_cost:
        return 1
    else:
        return math.exp((old_cost - new_cost) / temperature)

def simulated_annealing(x, y, min_people_per_shift, max_people_per_shift, initial_temperature, cooling_rate):
    current_solution = generate_initial_solution(x, y, min_people_per_shift, max_people_per_shift)
    current_cost = cost_function(current_solution)
    temperature = initial_temperature

    while temperature > 1:
        new_solution = get_neighbor(current_solution, y, min_people_per_shift, max_people_per_shift)
        new_cost = cost_function(new_solution)
        if acceptance_probability(current_cost, new_cost, temperature) > random.random():
            current_solution = new_solution
            current_cost = new_cost

        temperature *= cooling_rate

    return current_solution, current_cost


def create_preference_matrix(preference_list):
    preference_matrix = [[0 for _ in range(num_people)] for _ in range(num_people)]
    for person1, person2, preference in preference_list:
        preference_matrix[person1][person2] = preference
        preference_matrix[person2][person1] = preference
    return preference_matrix

def create_experience_matrix(experience_list):
    # experience_matrix = [[0 for _ in range(shifts)] for _ in range(num_people)]
    # for person, shift, experience in experience_list:
    #     experience_matrix[person][shift] = experience
    return


def create_unavailability_matrix(unavailability_list):
    unavailability_matrix = [[0 for _ in range(shifts)] for _ in range(num_people)]
    for person, shift in unavailability_list:
        unavailability_matrix[person][shift] = 1
    return unavailability_matrix


def cost_function(solution):
    # Calculate preference-based cost
    pref_cost = preference_cost(solution, create_preference_matrix(preference_list))
    # Calculate unavailability-based cost
    unavail_cost = unavailability_cost(solution, create_unavailability_matrix(unavailability_list)) * unavailabilityFactor
    
    # Calculate off-day-based cost
    offDay_cost = unavailability_cost(solution, create_unavailability_matrix(offDay_list)) * offDayFactor
    dist_cost = distribution_cost(solution)
    con_cost = consecutive_shifts_cost(solution)
    shift_cost = shift_count_cost(solution, number_of_shifts)

    # Add other cost components if necessary
    total_cost = pref_cost + dist_cost + unavail_cost + offDay_cost + con_cost + shift_cost

    return total_cost

def unavailability_cost(solution, availability_matrix):
    total_cost = 0
    for shift_index, shift in enumerate(solution):
        for person in shift:
            if not availability_matrix[person][shift_index]:
                total_cost += 1  # Penalize the cases when a person is assigned to an unavailable shift
    return total_cost

def preference_cost(solution, preference_matrix):
    total_cost = 0
    for shift in solution:
        for person1 in shift:
            for person2 in shift:
                if person1 != person2:
                    total_cost -= preference_matrix[person1][person2]
    return total_cost

def distribution_cost(solution):
    people_per_shift = [len(shift) for shift in solution]
    std_dev = np.std(people_per_shift)
    return std_dev

def shift_count_cost(solution, n):
    shift_counts = [sum(person in shift for shift in solution) for person in range(len(solution))]
    deviation = sum(abs(count - n) for count in shift_counts) / len(solution)
    return deviation

## check this
def consecutive_shifts_cost(solution):
    total_cost = 0
    last_shift_index = {}
    for shift in solution:
        for i, person in enumerate(shift):
            if person in last_shift_index and i - last_shift_index[person] < 3:
                total_cost += 1  # Penalize shifts that violate the minimum distance constraint
            last_shift_index[person] = i
    print(total_cost)
    return total_cost

if __name__ == "__main__":
    best_solution, best_cost = simulated_annealing(shifts, num_people, min_people_per_shift, max_people_per_shift, initial_temperature, cooling_rate)
    print(f"Best solution: {best_solution}")
    print(f"Best cost: {best_cost}")

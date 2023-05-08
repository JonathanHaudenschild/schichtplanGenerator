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


unavailabilityFactor = 250
offDayFactor = 20
consecutiveFactor = 150

shifts = 28  # number of shifts
num_people = 61   # number of people
number_of_shifts = 5  # number of shifts per person
min_people_per_shift = 10
max_people_per_shift = 12
initial_temperature = 1000
cooling_rate = 0.9999

def generate_initial_solution(x, y, shifts_per_person, max_people_per_shift, min_people_per_shift):
    solution = [set() for _ in range(x)]

    for person in range(y):
        assigned_shifts = set()
        while len(assigned_shifts) < shifts_per_person:
            shift = random.randint(0, x - 1)
            if len(solution[shift]) < max_people_per_shift and shift not in assigned_shifts:
                # Higher probability of adding a person if the shift has less than the minimum people
                if len(solution[shift]) < min_people_per_shift or random.random() < 0.90:
                    # Temporarily add the person to check for consecutive shifts constraint violation
                    solution[shift].add(person)
                    if consecutive_shifts(solution, shift, person) == 0:
                        assigned_shifts.add(shift)
                    else:
                        # Remove the person if the consecutive shifts constraint is violated
                        solution[shift].remove(person)
                else:
                    # Add the person to the next available shift with capacity
                    for next_shift in range(shift + 1, x):
                        if len(solution[next_shift]) < max_people_per_shift and next_shift not in assigned_shifts:
                            solution[next_shift].add(person)
                            assigned_shifts.add(next_shift)
                            break
                    else:
                        # If no shifts with capacity are found after the current shift, search before it
                        for prev_shift in range(0, shift):
                            if len(solution[prev_shift]) < max_people_per_shift and prev_shift not in assigned_shifts:
                                solution[prev_shift].add(person)
                                assigned_shifts.add(prev_shift)
                                break
    return solution


def get_neighbor(solution, min_people_per_shift, max_people_per_shift, unavailability_matrix, max_attempts=1000):
    attempts = 0
    while attempts < max_attempts:
        new_solution = solution.copy()
        index1 = random.randint(0, len(solution) - 1)
        index2 = random.randint(0, len(solution) - 1)
        shift1 = new_solution[index1]
        shift2 = new_solution[index2]

        if len(shift1) > min_people_per_shift and len(shift2) < min_people_per_shift:
            # Move a person from shift1 to shift2
            person_to_move = get_random_element(shift1)
            if person_to_move not in shift2:
                    shift1.remove(person_to_move)
                    shift2.add(person_to_move)
                    new_solution[index1] = shift1
                    new_solution[index2] = shift2
                    if consecutive_shifts(new_solution, index2, person_to_move) == 0 and unavailability_cost(new_solution, index2, unavailability_matrix, person_to_move) == 0:
                        return new_solution  # The neighbor solution satisfies both hard constraints
        else:
            # Swap people between the shifts if possible
            person1 = get_random_element(shift1)
            person2 = get_random_element(shift2)

            if person1 not in shift2 and person2 not in shift1:
                shift1.remove(person1)
                shift1.add(person2)
                shift2.remove(person2)
                shift2.add(person1)
                new_solution[index1] = shift1
                new_solution[index2] = shift2

                if consecutive_shifts(new_solution, index1, person1) == 0 and consecutive_shifts(new_solution, index1, person2) == 0 and unavailability_cost(new_solution, index2, unavailability_matrix, person1) == 0 and unavailability_cost(new_solution, index1, unavailability_matrix, person2) == 0:
                    return new_solution  # The neighbor solution satisfies both hard constraints

        attempts += 1

    # Return the original solution if no valid neighbor is found after max_attempts
    print("No valid neighbor found after", max_attempts, "attempts")
    return solution


def get_random_element(s):
    return random.choice(list(s))


def adaptive_cooling_rate(initial_temperature, min_temperature, cooling_factor):
    return max(min_temperature, initial_temperature * cooling_factor)


def acceptance_probability(old_cost, new_cost, temperature):
    if new_cost < old_cost:
        return 1
    else:
        return math.exp(-(abs(new_cost - old_cost) / temperature))

def simulated_annealing(x, y, min_people_per_shift, max_people_per_shift, initial_temperature, cooling_rate, max_iterations_without_improvement=1000):
    current_solution = generate_initial_solution(x, y, number_of_shifts, max_people_per_shift, min_people_per_shift)
    current_cost = cost_function(current_solution)
    print(f"Current solution: {current_solution}")
    print(f"Current cost: {current_cost}")
    temperature = initial_temperature
    iterations_without_improvement = 0

    while temperature > 1 and iterations_without_improvement < max_iterations_without_improvement:
        new_solution = get_neighbor(current_solution, min_people_per_shift, max_people_per_shift, create_unavailability_matrix(unavailability_list))
        new_cost = cost_function(new_solution)
        if acceptance_probability(current_cost, new_cost, temperature) > random.random():
            print(f"New cost: {new_cost}")
            current_solution = new_solution
            current_cost = new_cost
            iterations_without_improvement = 0  # Reset the counter when an improvement is found
        else:
            iterations_without_improvement += 1

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

    # Calculate off-day-based cost
    oday_cost = offDay_cost(solution, create_unavailability_matrix(offDay_list))
    
    cons_cost = consecutive_shifts_cost(solution)

    # Add other cost components if necessary
    total_cost = pref_cost + oday_cost + cons_cost

    return total_cost

def offDay_cost(solution, availability_matrix):
    total_cost = 0
    for shift_index, shift in enumerate(solution):
        for person in shift:
            if not availability_matrix[person][shift_index]:
                total_cost += 1  # Penalize the cases when a person is assigned to an unavailable shift
    return total_cost

def unavailability_cost(solution, shift_index, unavailability_matrix, person):
        if person in solution[shift_index] and unavailability_matrix[person][shift_index]:
            return 1  # Penalize the cases when a person is assigned to an unavailable shift
        return 0

def preference_cost(solution, preference_matrix):
    total_cost = 0
    for shift in solution:
        for person1 in shift:
            for person2 in shift:
                if person1 != person2:
                    total_cost -= preference_matrix[person1][person2]
    return total_cost

def consecutive_shifts_cost(solution):
    total_cost = 0
    for shift_index, shift in enumerate(solution):
        for person in shift:
            total_cost += consecutive_shifts(solution, shift_index, person)
    return total_cost

def consecutive_shifts(solution, shift_index, person):
    # Check previous shifts
    if shift_index > 0:
        last_shift = solution[shift_index - 1]
        if person in last_shift:
            return 1  # Return the penalty as soon as the constraint is violated
        if shift_index > 1:
            second_last_shift = solution[shift_index - 2]
            if person in second_last_shift:
                return 1

    # Check next shifts
    if shift_index + 1 < len(solution):
        next_shift = solution[shift_index + 1]
        if person in next_shift:
            return 1
        if shift_index + 2 < len(solution):
            second_next_shift = solution[shift_index + 2]
            if person in second_next_shift:
                return 1

    return 0  # No constraint violations were found


if __name__ == "__main__":
    best_solution, best_cost = simulated_annealing(shifts, num_people, min_people_per_shift, max_people_per_shift, initial_temperature, cooling_rate, max_iterations_without_improvement=1000) 
    print(f"Best solution: {best_solution}")
    print(f"Best cost: {best_cost}")

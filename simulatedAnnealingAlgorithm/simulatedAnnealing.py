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

preferred_shift_list = [
    (0, (-3, -1, -2, 0)),
    (1, (-3, -1, -2, 0)),
    (2, (-3, -1, -2, 0)),
    (3, (-3, -1, -2, 0)),
    (4, (-3, -1, -2, 0)),
]
    
    

# Update the experience matrix based on the experience data
# neu: 0
# 1 Jahr: +1
# >1 Jahr: +2
experience_list = [
    (0, 2),  # Person 0 has experience of 5
    (1, 2),  # Person 1 has experience of 4
    (1, 2),  # Person 1 has experience of 4
    # Add more experience here
]

# Update the unavailability matrix based on the unavailability data
unavailability_list= [
    (0, 2),  # Person 0 is unavailable for shift 2
    (0, 2),  # Person 0 is unavailable for shift 2
    (1, 4),  # Person 1 is unavailable for shift 4
    # Add more unavailability data here
]

shift_capacity_list= [
    (0, (5, 10)),  # Shift 0 has a minimum capacity of 10 and a maximum capacity of 11
    (1, (5, 10)),  # Shift 1 has a minimum capacity of 10 and a maximum capacity of 11
    (2, (5, 10)),  # Shift 2 has a minimum capacity of 10 and a maximum capacity of 11
    (3, (10, 12)),  # Shift 3 has a minimum capacity of 10 and a maximum capacity of 11
    (4, (10, 12)),  # Shift 4 has a minimum capacity of 10 and a maximum capacity of 11
    (5, (10, 12)),  # Shift 5 has a minimum capacity of 10 and a maximum capacity of 11
    (6, (10, 12)),  # Shift 6 has a minimum capacity of 10 and a maximum capacity of 11
    (7, (10, 12)),  # Shift 7 has a minimum capacity of 10 and a maximum capacity of 11
    (8, (10, 12)),  # Shift 8 has a minimum capacity of 10 and a maximum capacity of 11
    (9, (10, 12)),  # Shift 9 has a minimum capacity of 10 and a maximum capacity of 11
    (10, (10, 12)),  # Shift 10 has a minimum capacity of 10 and a maximum capacity of 11
    (11, (10, 12)),  # Shift 11 has a minimum capacity of 10 and a maximum capacity of 11
    (12, (10, 12)),  # Shift 12 has a minimum capacity of 10 and a maximum capacity of 11
    (13, (10, 12)),  # Shift 13 has a minimum capacity of 10 and a maximum capacity of 11
    (14, (10, 12)),  # Shift 14 has a minimum capacity of 10 and a maximum capacity of 11
    (15, (10, 12)),  # Shift 15 has a minimum capacity of 10 and a maximum capacity of 11
    (16, (10, 12)),  # Shift 16 has a minimum capacity of 10 and a maximum capacity of 11
    (17, (10, 12)),  # Shift 17 has a minimum capacity of 10 and a maximum capacity of 11
    (18, (10, 12)),  # Shift 18 has a minimum capacity of 10 and a maximum capacity of 11
    (19, (10, 12)),  # Shift 19 has a minimum capacity of 10 and a maximum capacity of 11
    (20, (10, 12)),  # Shift 20 has a minimum capacity of 10 and a maximum capacity of 11
    (21, (10, 12)),  # Shift 21 has a minimum capacity of 10 and a maximum capacity of 11
    (22, (10, 12)),  # Shift 22 has a minimum capacity of 10 and a maximum capacity of 11
    (23, (5, 8)),   # Shift 23 has a minimum capacity of 10 and a maximum capacity of 11
    (24, (5, 8)),   # Shift 23 has a minimum capacity of 10 and a maximum capacity of 11
    (25, (5, 8)),   # Shift 23 has a minimum capacity of 10 and a maximum capacity of 11
    (26, (5, 8))   # Shift 23 has a minimum capacity of 10 and a maximum capacity of 11
]

person_capacity_list   = [
    (0, 4),   # Person 0 has a capacity of 4
    (1, 4),   # Person 1 has a capacity of 4
    (2, 4),   # Person 2 has a capacity of 4
    (3, 4),   # Person 3 has a capacity of 4
    (4, 4),   # Person 4 has a capacity of 4
    (5, 4),   # Person 5 has a capacity of 4
    (6, 4),   # Person 6 has a capacity of 4
    (7, 4),   # Person 7 has a capacity of 4
    (8, 4),   # Person 8 has a capacity of 4
    (9, 4),   # Person 9 has a capacity of 4
    (10, 4),  # Person 10 has a capacity of 4
    (11, 4),  # Person 11 has a capacity of 4
    (12, 4),  # Person 12 has a capacity of 4
    (13, 4),  # Person 13 has a capacity of 4
    (14, 4),  # Person 14 has a capacity of 4
    (15, 4),  # Person 15 has a capacity of 4
    (16, 4),  # Person 16 has a capacity of 4
    (17, 4),  # Person 17 has a capacity of 4
    (18, 4),  # Person 18 has a capacity of 4
    (19, 4),  # Person 19 has a capacity of 4
    (20, 4),  # Person 20 has a capacity of 4
    (21, 4),  # Person 21 has a capacity of 4
    (22, 4),  # Person 22 has a capacity of 4
    (23, 4),  # Person 23 has a capacity of 4
    (24, 4),  # Person 24 has a capacity of 4
    (25, 4),  # Person 25 has a capacity of 4
    (26, 4),  # Person 26 has a capacity of 4
    (27, 4),  # Person 27 has a capacity of 4
    (28, 4),  # Person 28 has a capacity of 4
    (29, 4),  # Person 29 has a capacity of 4
    (30, 4),  # Person 30 has a capacity of 4
    (31, 4),  # Person 31 has a capacity of 4
    (32, 4),  # Person 32 has a capacity of 4
    (33, 4),  # Person 33 has a capacity of 4
    (34, 4),  # Person 34 has a capacity of 4
    (35, 4),  # Person 35 has a capacity of 4
    (36, 4),  # Person 36 has a capacity of 4
    (37, 4),  # Person 37 has a capacity of 4
    (38, 4),  # Person 38 has a capacity of 4
    (39, 3),  # Person 39 has a capacity of 4
]


# Update the off-day matrix based on the off-day data
offDay_list= [
    (0, 2),  # Person 0 is unavailable for shift 2
    (1, 4),  # Person 1 is unavailable for shift 4
    # Add more unavailability data here
]



num_of_shifts = 27  # number of shifts
num_people = 61   # number of people
num_of_shifts_per_person = 5  # number of shifts per person
initial_temperature = 1000
cooling_rate = 0.9999

def generate_initial_solution(x, y):
    solution = [set() for _ in range(x)]
    

    for person in range(y):
        assigned_shifts = set()
        while len(assigned_shifts) < create_persons_capacity_array(person_capacity_list)[person]:
            shift = random.randint(0, x - 1)
            if len(solution[shift]) < create_shift_capacity_matrix(shift_capacity_list)[1][shift] and shift not in assigned_shifts:
                # Higher probability of adding a person if the shift has less than the minimum people
                if len(solution[shift]) < create_shift_capacity_matrix(shift_capacity_list)[0][shift] or random.random() < 0.90:
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
                        if len(solution[next_shift]) < create_shift_capacity_matrix(shift_capacity_list)[1][next_shift] and next_shift not in assigned_shifts:
                            solution[next_shift].add(person)
                            if consecutive_shifts(solution, next_shift, person) == 0:
                                assigned_shifts.add(next_shift)
                            else:
                                # Remove the person if the consecutive shifts constraint is violated
                                solution[next_shift].remove(person)
                    else:
                        # If no shifts with capacity are found after the current shift, search before it
                        for prev_shift in range(0, shift):
                            if len(solution[prev_shift]) < create_shift_capacity_matrix(shift_capacity_list)[1][prev_shift] and prev_shift not in assigned_shifts:
                                solution[prev_shift].add(person)
                                if consecutive_shifts(solution, prev_shift, person) == 0:
                                    assigned_shifts.add(prev_shift)
                                else:
                                    # Remove the person if the consecutive shifts constraint is violated
                                    solution[prev_shift].remove(person)
    return solution


def get_neighbor(solution, unavailability_matrix, max_attempts=1000):
    attempts = 0
    while attempts < max_attempts:
        index1 = random.randint(0, len(solution) - 1)
        index2 = random.randint(0, len(solution) - 1)
        shift1 = solution[index1].copy()
        shift2 = solution[index2].copy()

        if len(shift1) > create_shift_capacity_matrix(shift_capacity_list)[0][index1] and len(shift2) < create_shift_capacity_matrix(shift_capacity_list)[0][index2] :
            # Move a person from shift1 to shift2
            person_to_move = get_random_element(shift1)
            if person_to_move not in shift2 and consecutive_shifts(solution, index2, person_to_move) == 0 and unavailability_cost(solution, index2, unavailability_matrix, person_to_move) == 0:
                shift1.remove(person_to_move)
                shift2.add(person_to_move)
                new_solution = solution.copy()
                new_solution[index1] = shift1
                new_solution[index2] = shift2
                return new_solution  # The neighbor solution satisfies both hard constraints
        else:
            # Swap people between the shifts if possible
            person1 = get_random_element(shift1)
            person2 = get_random_element(shift2)

            if person1 not in shift2 and person2 not in shift1 and consecutive_shifts(solution, index2, person1) == 0 and consecutive_shifts(solution, index1, person2) == 0 and unavailability_cost(solution, index2, unavailability_matrix, person1) == 0 and unavailability_cost(solution, index1, unavailability_matrix, person2) == 0:
                shift1.remove(person1)
                shift1.add(person2)
                shift2.remove(person2)
                shift2.add(person1)
                new_solution = solution.copy()
                new_solution[index1] = shift1
                new_solution[index2] = shift2
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

def simulated_annealing(x, y, initial_temperature, cooling_rate, max_iterations_without_improvement=1000):
    current_solution = generate_initial_solution(x, y)
    current_cost = cost_function(current_solution)
    print(f"Current solution: {current_solution}")
    print(f"Current cost: {current_cost}")
    temperature = initial_temperature
    iterations_without_improvement = 0

    while temperature > 1 and iterations_without_improvement < max_iterations_without_improvement:
        new_solution = get_neighbor(current_solution, create_unavailability_matrix(unavailability_list))
        new_cost = cost_function(new_solution)
        if acceptance_probability(current_cost, new_cost, temperature) > random.random():
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

def create_persons_capacity_array(capacity_list):
    capacity_array = [num_of_shifts_per_person] * num_people
    for capacity in capacity_list:
        capacity_array[capacity[0]] = capacity[1]
    return capacity_array

def create_experience_array(experience_list):
    experience_array = [1] * num_people
    for experience in experience_list:
        experience_array[experience[0]] = experience[1]
    return experience_array

def create_preferred_shift_matrix(pref_shift_list):
    matrix = [[0] * 4 for _ in range(num_people)]
    for i, (_, shift_values) in enumerate(pref_shift_list):
        matrix[i] = list(shift_values)
    return matrix

def create_unavailability_matrix(unavailability_list):
    unavailability_matrix = [[0 for _ in range(num_of_shifts)] for _ in range(num_people)]
    for person, shift in unavailability_list:
        unavailability_matrix[person][shift] = 1
    return unavailability_matrix

def create_shift_capacity_matrix(shift_capacity_list):
    shift_capacity_matrix = [[0 for _ in range(num_of_shifts)] for _ in range(2)]
    for shift, capacity in shift_capacity_list:
        shift_capacity_matrix[0][shift] = capacity[0]
        shift_capacity_matrix[1][shift] = capacity[1]
    return shift_capacity_matrix


def cost_function(solution):
    # # Calculate preference-based cost
    pref_cost = preference_cost(solution, create_preference_matrix(preference_list))
    exp_cost = mixedExperience_cost(solution, create_experience_array(experience_list))
    # # Calculate off-day-based cost
    oday_cost = offDay_cost(solution, create_unavailability_matrix(offDay_list))
    
    pref_shift_cost = preferred_shift_cost(solution, create_preferred_shift_matrix(preferred_shift_list))
    

    # Add other cost components if necessary
    total_cost = pref_cost + exp_cost + oday_cost + pref_shift_cost
    return total_cost

def mixedExperience_cost(solution, experience_array):
    total_cost = 0
    for shift_index, shift in enumerate(solution):
        
        total_experience = 0
        for person in shift:
            total_experience += experience_array[person]
        if total_experience < 5:
            total_cost += 20
    return total_cost 

def preferred_shift_cost(solution, preferred_shift_matrix):
    total_cost = 0
    for shift_index, shift in enumerate(solution):
        for person in shift:
            total_cost += preferred_shift_matrix[person][shift_index % 4] 
    return total_cost
                

def offDay_cost(solution, unavailability_matrix):
    total_cost = 0
    for shift_index, shift in enumerate(solution):
        for person in shift:
            if unavailability_matrix[person][shift_index]:
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
    for i in range(1, 3):
        if shift_index - i >= 0:
            previous_shift = solution[shift_index - i]
            if person in previous_shift:
                return 1  # Return the penalty as soon as the constraint is violated

    # Check next shifts
    for i in range(1, 3):
        if shift_index + i < len(solution):
            next_shift = solution[shift_index + i]
            if person in next_shift:
                return 1

    return 0  # No constraint violations were found


if __name__ == "__main__":
    best_solution, best_cost = simulated_annealing(num_of_shifts, num_people, initial_temperature, cooling_rate, max_iterations_without_improvement=1000) 
    print(f"Best solution: {best_solution}")
    print(f"Best cost: {best_cost}")

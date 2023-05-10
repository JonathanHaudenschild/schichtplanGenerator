

index_name_list = [
    (0, 'Berdi'),
    (1, 'Alejandro'),
    (2, 'Alexander Alex / Zwalle'),
    (3, 'Alina'),
    (4, 'Anna Ansen'),
    (5, 'Annabelle'),
    (6, 'Antonia'),
    (7, 'Bendix'),
    (8, 'Benjamin Ben'),
    (9, 'Bruno'),
    (10, 'Christian Chre'),
    (11, 'Christin Tine'),
    (12, 'Christoph Chris'),
    (13, 'Daniel'),
    (14, 'Elisa Lush'),
    (15, 'Fabs Fabs'),
    (16, 'Frederik Freddy'),
    (17, 'Gerrit'),
    (18, 'Geza'),
    (19, 'Grace'),
    (20, 'Hanna'),
    (21, 'Jannik'),
    (22, 'Jasper'),
    (23, 'Jonas'),
    (24, 'Judith'),
    (25, 'Lea'),
    (26, 'Leonie Leo'),
    (27, 'Lorenz'),
    (28, 'Lydia Lulu'),
    (29, 'Margret'),
    (30, 'Marie-Sophie Mary'),
    (31, 'Marlene'),
    (32, 'Max B'),
    (33, 'Maximilian Murmelo'),
    (34, 'Mohamed'),
    (35, 'Pablo'),
    (36, 'Paul'),
    (37, 'Philipp Phil'),
    (38, 'Philipp'),
    (39, 'Rani'),
    (40, 'Robert Bört'),
    (41, 'Sophie'),
    (42, 'Stefanie Steffi'),
    (43, 'Torben'),
    (44, 'Undine'),
    (45, 'Christian'),
    (46, 'Fabio'),
    (47, 'Iinaroosa Lina'),
    (48, 'Ksenia'),
    (49, 'Lisa'),
    (50, 'Mona'),
    (51, 'Natalie'),
    (52, 'Nathie'),
    (53, 'Nico'),
    (54, 'Paul B'),
    (55, 'Philipp Phipsi'),
    (56, 'Rose'),
    (57, 'Sasika'),
    (58, 'Platzperson'),
    (59, 'Platzperson 1'),
    (60, 'Platzperson 2'),
    (61, 'JONNY'),
    (62, 'JULIUS'),
    (63, 'JONATHAN'),
    (64, 'MAX'),
    (65, 'ANNA B'),
    (66, 'SEBI'),
    (67, 'ANNEKE'),
    (68, 'MITCH'),
    (69, 'DANA'),
    (70, 'ALI'),
    (71, 'MARIA'),
    (72, 'FABI'),
    (73, 'LUKAS')
]

shift_name_list = [
    (0, '13:00 - 19:00'),
    (1, '19:00 - 01:00'),
    (2, '01:00 - 07:00'),
    (3, '07:00 - 13:00'),
]

shift_ranking_list = [
    (1, (0, 1, 2, 3)),
    (3, (4, 5, 6, 7, 20, 21, 22, 23 )),
    (6, (8, 9, 10, 11)),
    (9, (12, 13, 14, 15, 16, 17, 18, 19)),
]

shift_type_ranking_list = [
    (1, (2)),
    (3, (1, 3)),
    (9, (0)),
]

# Update the preference matrix based on the preferences
# Positive values indicate a preference to work together, and negative values indicate a preference not to work together
preference_list = [
    (3, 17, 5),  # Person 0 and person 1 have a preference of 5 to work together
    (45, 50, 5),
    (36, 28, 5),
    (6, 11, 1),
    (6, 46, 1),
    (11, 46, 1),

    ####
    (0, 32, 5),
    (0, 40, 4),
    (33, 32, -7),
    (32, 33, 5),
    (20, 21, 5)
    # Add more preferences here
]

preferred_shift_type_list = [
    (4, 1),  # Person 3 prefers to work check-in shifts
    (34, 1)
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
    (33, 2),  # Person 1 has experience of 4
    # Add more experience here
]

# Update the unavailability matrix based on the unavailability data
unavailability_list = [
    (0, (2, 3)),  # Person 0 is unavailable for shifts 2
    (4, (2, 3)),  # Person 0 is unavailable for shift 2
    (1, (2, 3)),  # Person 1 is unavailable for shift 4
    (16, (0, 1, 2, 3, 4, 5, 6, 7)),  # Person 1 is unavailable for shift 4

    ####
    (33, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9)),
    # Add more unavailability data here
]

# Update the off-day matrix based on the off-day data
offDay_list= [
    (0, (2, 3)),  # Person 0 is unavailable for shift 2
    (1, (3, 5)),  # Person 1 is unavailable for shift 4
    (32, (12, 13, 14, 15))
    # Add more unavailability data here

]

shift_type_list= [
    (0, 1),  # Shift 0 is a check-in shift
    (1, 1),  # Shift 1 is a check-in shift
    (2, 1),  # Shift 2 is a check-in shift
    (3, 1),  # Shift 3 is a check-in shift
    (4, 1),  # Shift 4 is a check-in shift
    (5, 1),  # Shift 4 is a check-in shift
    (6, 1),  # Shift 4 is a check-in shift
    (7, 1),  # Shift 4 is a check-in shift
    (8, 1),  # Shift 4 is a check-in shift
    (9, 1),  # Shift 4 is a check-in shift
]

# Update the off-day matrix based on the off-day data
mandatory_shifts_list= [
    (8, 9, 10, 11),
    (12, 13, 14, 15),
    (16, 17, 18, 19, 20)
]

shift_capacity_list= [
    # 27.06.2023
    (0, (12, 13)),  # Shift 0 has a minimum capacity of 10 and a maximum capacity of 11
    (1, (17, 18)),  # Shift 1 has a minimum capacity of 10 and a maximum capacity of 11
    # 28.06.2023
    (2, (17, 18)),  # Shift 2 has a minimum capacity of 10 and a maximum capacity of 11
    (3, (17, 19)),  # Shift 3 has a miDnimum capacity of 10 and a maximum capacity of 11
    (4, (17, 18)),  # Shift 4 has a minimum capacity of 10 and a maximum capacity of 11
    (5, (16, 18)),  # Shift 5 has a minimum capacity of 10 and a maximum capacity of 11
    # 29.06.2023
    (6, (12, 14)),  # Shift 6 has a minimum capacity of 10 and a maximum capacity of 11
    (7, (15, 17)),  # Shift 7 has a minimum capacity of 10 and a maximum capacity of 11
    (8, (15, 17)),  # Shift 8 has a minimum capacity of 10 and a maximum capacity of 11
    (9, (14, 16)),  # Shift 9 has a minimum capacity of 10 and a maximum capacity of 11
    # 30.06.2023
    (10, (10, 11)),  # Shift 10 has a minimum capacity of 10 and a maximum capacity of 11
    (11, (13, 15)),  # Shift 11 has a minimum capacity of 10 and a maximum capacity of 11
    (12, (13, 15)),  # Shift 12 has a minimum capacity of 10 and a maximum capacity of 11
    (13, (11, 12)),  # Shift 13 has a minimum capacity of 10 and a maximum capacity of 11
    # 01.07.2023
    (14, (8, 10)),  # Shift 14 has a minimum capacity of 10 and a maximum capacity of 11D
    (15, (11, 12)),  # Shift 15 has a minimum capacity of 10 and a maximum capacity of 11
    (16, (11, 14)),  # Shift 16 has a minimum capacity of 10 and a maximum capacity of 11
    (17, (11, 14)),  # Shift 17 has a minimum capacity of 10 and a maximum capacity of 11
    # 02.07.2023    
    (18, (9, 10)),  # Shift 18 has a minimum capacity of 10 and a maximum capacity of 11
    (19, (11, 12)),  # Shift 19 has a minimum capacity of 10 and a maximum capacity of 11
    (20, (11, 12)),  # Shift 20 has a minimum capacity of 10 and a maximum capacity of 11
    (21, (10, 11)),  # Shift 21 has a minimum capacity of 10 and a maximum capacity of 11
    # 03.07.2023
    (22, (5, 7)),  # Shift 22 has a minimum capacity of 10 and a maximum capacity of 11
    (23, (7, 8)),   # Shift 23 has a minimum capacity of 10 and a maximum capacity of 11
]

person_capacity_list   = [
    (16, 4),   # Person 0 has a capacity of 4
    (61, 1),   # Person 12 has a capacity of 4
    (62, 1),   # Person 12 has a capacity of 4
    (63, 1),   # Person 13 has a capacity of 4
    (64, 1),   # Person 2 has a capacity of 4
    (65, 1),   # Person 3 has a capacity of 4
    (66, 1),   # Person 4 has a capacity of 4
    (67, 1),   # Person 5 has a capacity of 4
    (68, 1),   # Person 6 has a capacity of 4
    (69, 1),   # Person 7 has a capacity of 4
    (70, 1),   # Person 8 has a capacity of 4
    (71, 1),   # Person 9 has a capacity of 4
    (72, 1),   # Person 10 has a capacity of 4
    (73, 1),   # Person 11 has a capacity of 4
]


num_of_shifts = len(shift_capacity_list)  # number of shifts
num_people = len(index_name_list)   # number of people
num_of_shifts_per_person = 5  # number of shifts per person
num_of_shift_types = len(shift_name_list)



#########################################################
#SUPERVISION

index_name_list = [
    (0, 'LUKAS'),
    (1, 'JULIUS'),
    (2, 'JONATHAN'),
    (3, 'MAX'),
    (4, 'ANNA B'),
    (5, 'SEBI'),
    (6, 'ANNEKE'),
    (7, 'MITCH'),
    (8, 'DANA'),
    (9, 'ALI'),
    (10, 'MARIA'),
    (11, 'FABI'),
]

shift_name_list = [
    (0, '07:00 - 15:00'),
    (1, '15:00 - 23:00'),
    (2, '23:00 - 07:00'),
]

shift_ranking_list = [
    (1, (0, 1, 2, 3)),
    (3, (4, 5, 6, 16, 17)),
    (6, (7, 8, 9)),
    (9, (10, 11, 12, 13, 14, 15)),
]

shift_type_ranking_list = [
    (1, (2)),
    (3, (0, 1)),
]

# Update the preference matrix based on the preferences
# Positive values indicate a preference to work together, and negative values indicate a preference not to work together
preference_list = [
    # (3, 17, 5),  # Person 0 and person 1 have a preference of 5 to work together
    # (45, 50, 5),
    # (36, 28, 5),
    # (6, 11, 1),
    # (6, 46, 1),
    # (11, 46, 1),
    # Add more preferences here
]

preferred_shift_type_list = [
    # (4, 1),  # Person 3 prefers to work check-in shifts
    # (34, 1)
]


preferred_shift_list = [
    # (0, (-3, -1, -2, 0)),
    # (1, (-3, -1, -2, 0)),
    # (2, (-3, -1, -2, 0)),
    # (3, (-3, -1, -2, 0)),
    # (4, (-3, -1, -2, 0)),
]
    

# Update the experience matrix based on the experience data
# neu: 0
# 1 Jahr: +1
# >1 Jahr: +2
experience_list = [
    (0, 3),  # Person 0 has experience of 5
    (1, 5),  # Person 1 has experience of 4
    (2, 3),  # Person 1 has experience of 4
    (3, 5),  # Person 1 has experience of 4
    (4, 5),  # Person 1 has experience of 4
    (5, 5),  # Person 1 has experience of 4
    (6, 5),  # Person 1 has experience of 4
    (7, 5),  # Person 1 has experience of 4
    (8, 0),  # Person 1 has experience of 4
    (9, 0),  # Person 1 has experience of 4
    (10, 0),  # Person 1 has experience of 4
    (11, 0),  # Person 1 has experience of 4
    # Add more experience here
]

# Update the unavailability matrix based on the unavailability data
unavailability_list = [
    # (0, (2, 3)),  # Person 0 is unavailable for shifts 2
    # (4, (2, 3)),  # Person 0 is unavailable for shift 2
    # (1, (2, 3)),  # Person 1 is unavailable for shift 4
    (7, (0, 1, 2, 16, 17)),
    (5, (0, 1, 2, 16, 17)),
    (3, (0, 1, 2, 16, 17)),
    (6, (2, 5, 12, 9, 10, 15)),  # Person 1 is unavailable for shift 4
    (10, (13, 14, 15, 16, 17)),  # Person 1 is unavailable for shift 4
    # Add more unavailability data here
]

# Update the off-day matrix based on the off-day data
offDay_list= [
    # (0, (2, 3)),  # Person 0 is unavailable for shift 2
    # (1, (3, 5)),  # Person 1 is unavailable for shift 4
    # Add more unavailability data here
]

shift_type_list= [
    (0, 1),  # Shift 0 is a check-in shift
    (1, 1),  # Shift 1 is a check-in shift
    (2, 1),  # Shift 2 is a check-in shift
    (3, 1),  # Shift 3 is a check-in shift
    (4, 1),  # Shift 4 is a check-in shift
    (5, 1),  # Shift 4 is a check-in shift
    (6, 1),  # Shift 4 is a check-in shift
    (7, 1),  # Shift 4 is a check-in shift
    (8, 1),  # Shift 4 is a check-in shift
    (9, 1),  # Shift 4 is a check-in shift
]

mandatory_shifts_list= [
    (8, 9, 10, 11),
    (12, 13, 14, 15),
    (16, 17, 18, 19, 20)
]



shift_capacity_list= [
    # 27.06.2023
    (0, (2, 2)),  # Shift 0 has a minimum capacity of 10 and a maximum capacity of 11
    (1, (2, 2)),  # Shift 0 has a minimum capacity of 10 and a maximum capacity of 11
    (2, (2, 2)),  # Shift 1 has a minimum capacity of 10 and a maximum capacity of 11
    # 28.06.2023
    (3, (2, 2)),  # Shift 2 has a minimum capacity of 10 and a maximum capacity of 11
    (4, (2, 2)),  # Shift 3 has a minimum capacity of 10 and a maximum capacity of 11
    (5, (2, 2)),  # Shift 4 has a minimum capacity of 10 and a maximum capacity of 11
    # 29.06.2023
    (6, (2, 2)),  # Shift 6 has a minimum capacity of 10 and a maximum capacity of 11
    (7, (2, 2)),  # Shift 7 has a minimum capacity of 10 and a maximum capacity of 11
    (8, (2, 2)),  # Shift 8 has a minimum capacity of 10 and a maximum capacity of 11
    # 30.06.2023
    (9, (2, 2)),  # Shift 9 has a minimum capacity of 10 and a maximum capacity of 11
    (10, (2, 2)),  # Shift 10 has a minimum capacity of 10 and a maximum capacity of 11
    (11, (2, 2)),  # Shift 11 has a minimum capacity of 10 and a maximum capacity of 11
    # 01.07.2023
    (12, (2, 2)),  # Shift 14 has a minimum capacity of 10 and a maximum capacity of 11D
    (13, (2, 2)),  # Shift 15 has a minimum capacity of 10 and a maximum capacity of 11
    (14, (2, 2)),  # Shift 16 has a minimum capacity of 10 and a maximum capacity of 11
    # 02.07.2023    
    (15, (2, 2)),  # Shift 18 has a minimum capacity of 10 and a maximum capacity of 11
    (16, (2, 2)),  # Shift 19 has a minimum capacity of 10 and a maximum capacity of 11
    (17, (2, 2)),  # Shift 20 has a minimum capacity of 10 and a maximum capacity of 11
]

person_capacity_list   = [
]
USE employee_db;

INSERT INTO department (name) VALUES ('Sales'), ('Engineering'), ('HR'), ('Finance');

INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 100000, 1), ('Sales Person', 80000, 1), ('Lead Engineer', 150000, 2), ('Software Engineer', 120000, 2), ('HR Lead', 90000, 3), ('HR Assistant', 60000, 3), ('Accountant', 70000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Smith', 2, 1), ('Karen', 'Johnson', 3, NULL), ('James', 'Brown', 4, 3), ('Emily', 'Davis', 5, NULL), ('Michael', 'Miller', 6, 5), ('Mary', 'Taylor', 7, NULL);

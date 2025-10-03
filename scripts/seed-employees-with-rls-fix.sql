-- Seed employees with RLS disabled temporarily
-- This script adds 40 employees across all departments

-- First, get the department IDs
DO $$
DECLARE
    dept_it UUID;
    dept_hr UUID;
    dept_finance UUID;
    dept_operations UUID;
    dept_sales UUID;
BEGIN
    -- Get department IDs
    SELECT id INTO dept_it FROM departments WHERE name = 'IT' LIMIT 1;
    SELECT id INTO dept_hr FROM departments WHERE name = 'HR' LIMIT 1;
    SELECT id INTO dept_finance FROM departments WHERE name = 'Finance' LIMIT 1;
    SELECT id INTO dept_operations FROM departments WHERE name = 'Operations' LIMIT 1;
    SELECT id INTO dept_sales FROM departments WHERE name = 'Sales' LIMIT 1;

    -- Disable RLS temporarily for profiles table
    ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

    -- Delete existing test employees (keep only EMP001 - the admin)
    DELETE FROM attendance_records WHERE user_id IN (
        SELECT id FROM profiles WHERE employee_id != 'EMP001'
    );
    DELETE FROM profiles WHERE employee_id != 'EMP001';

    -- Insert IT Department employees (8 employees)
    INSERT INTO profiles (id, email, full_name, role, department_id, employee_id, phone, is_active, created_at, updated_at)
    VALUES
        (gen_random_uuid(), 'john.smith@company.com', 'John Smith', 'manager', dept_it, 'EMP1001', '+1234567001', true, NOW(), NOW()),
        (gen_random_uuid(), 'sarah.johnson@company.com', 'Sarah Johnson', 'employee', dept_it, 'EMP1002', '+1234567002', true, NOW(), NOW()),
        (gen_random_uuid(), 'michael.brown@company.com', 'Michael Brown', 'employee', dept_it, 'EMP1003', '+1234567003', true, NOW(), NOW()),
        (gen_random_uuid(), 'emily.davis@company.com', 'Emily Davis', 'employee', dept_it, 'EMP1004', '+1234567004', true, NOW(), NOW()),
        (gen_random_uuid(), 'david.wilson@company.com', 'David Wilson', 'employee', dept_it, 'EMP1005', '+1234567005', true, NOW(), NOW()),
        (gen_random_uuid(), 'lisa.anderson@company.com', 'Lisa Anderson', 'employee', dept_it, 'EMP1006', '+1234567006', true, NOW(), NOW()),
        (gen_random_uuid(), 'james.taylor@company.com', 'James Taylor', 'employee', dept_it, 'EMP1007', '+1234567007', true, NOW(), NOW()),
        (gen_random_uuid(), 'jennifer.thomas@company.com', 'Jennifer Thomas', 'employee', dept_it, 'EMP1008', '+1234567008', true, NOW(), NOW());

    -- Insert HR Department employees (8 employees)
    INSERT INTO profiles (id, email, full_name, role, department_id, employee_id, phone, is_active, created_at, updated_at)
    VALUES
        (gen_random_uuid(), 'robert.martinez@company.com', 'Robert Martinez', 'hr', dept_hr, 'EMP1009', '+1234567009', true, NOW(), NOW()),
        (gen_random_uuid(), 'maria.garcia@company.com', 'Maria Garcia', 'hr', dept_hr, 'EMP1010', '+1234567010', true, NOW(), NOW()),
        (gen_random_uuid(), 'william.rodriguez@company.com', 'William Rodriguez', 'employee', dept_hr, 'EMP1011', '+1234567011', true, NOW(), NOW()),
        (gen_random_uuid(), 'patricia.hernandez@company.com', 'Patricia Hernandez', 'employee', dept_hr, 'EMP1012', '+1234567012', true, NOW(), NOW()),
        (gen_random_uuid(), 'charles.lopez@company.com', 'Charles Lopez', 'employee', dept_hr, 'EMP1013', '+1234567013', true, NOW(), NOW()),
        (gen_random_uuid(), 'linda.gonzalez@company.com', 'Linda Gonzalez', 'employee', dept_hr, 'EMP1014', '+1234567014', true, NOW(), NOW()),
        (gen_random_uuid(), 'thomas.perez@company.com', 'Thomas Perez', 'employee', dept_hr, 'EMP1015', '+1234567015', true, NOW(), NOW()),
        (gen_random_uuid(), 'barbara.sanchez@company.com', 'Barbara Sanchez', 'employee', dept_hr, 'EMP1016', '+1234567016', true, NOW(), NOW());

    -- Insert Finance Department employees (8 employees)
    INSERT INTO profiles (id, email, full_name, role, department_id, employee_id, phone, is_active, created_at, updated_at)
    VALUES
        (gen_random_uuid(), 'christopher.ramirez@company.com', 'Christopher Ramirez', 'manager', dept_finance, 'EMP1017', '+1234567017', true, NOW(), NOW()),
        (gen_random_uuid(), 'susan.torres@company.com', 'Susan Torres', 'employee', dept_finance, 'EMP1018', '+1234567018', true, NOW(), NOW()),
        (gen_random_uuid(), 'daniel.rivera@company.com', 'Daniel Rivera', 'employee', dept_finance, 'EMP1019', '+1234567019', true, NOW(), NOW()),
        (gen_random_uuid(), 'jessica.flores@company.com', 'Jessica Flores', 'employee', dept_finance, 'EMP1020', '+1234567020', true, NOW(), NOW()),
        (gen_random_uuid(), 'matthew.gomez@company.com', 'Matthew Gomez', 'employee', dept_finance, 'EMP1021', '+1234567021', true, NOW(), NOW()),
        (gen_random_uuid(), 'nancy.cruz@company.com', 'Nancy Cruz', 'employee', dept_finance, 'EMP1022', '+1234567022', true, NOW(), NOW()),
        (gen_random_uuid(), 'anthony.morales@company.com', 'Anthony Morales', 'employee', dept_finance, 'EMP1023', '+1234567023', true, NOW(), NOW()),
        (gen_random_uuid(), 'karen.reyes@company.com', 'Karen Reyes', 'employee', dept_finance, 'EMP1024', '+1234567024', true, NOW(), NOW());

    -- Insert Operations Department employees (8 employees)
    INSERT INTO profiles (id, email, full_name, role, department_id, employee_id, phone, is_active, created_at, updated_at)
    VALUES
        (gen_random_uuid(), 'mark.jimenez@company.com', 'Mark Jimenez', 'manager', dept_operations, 'EMP1025', '+1234567025', true, NOW(), NOW()),
        (gen_random_uuid(), 'betty.ortiz@company.com', 'Betty Ortiz', 'employee', dept_operations, 'EMP1026', '+1234567026', true, NOW(), NOW()),
        (gen_random_uuid(), 'donald.castillo@company.com', 'Donald Castillo', 'employee', dept_operations, 'EMP1027', '+1234567027', true, NOW(), NOW()),
        (gen_random_uuid(), 'helen.romero@company.com', 'Helen Romero', 'employee', dept_operations, 'EMP1028', '+1234567028', true, NOW(), NOW()),
        (gen_random_uuid(), 'steven.gutierrez@company.com', 'Steven Gutierrez', 'employee', dept_operations, 'EMP1029', '+1234567029', true, NOW(), NOW()),
        (gen_random_uuid(), 'dorothy.alvarez@company.com', 'Dorothy Alvarez', 'employee', dept_operations, 'EMP1030', '+1234567030', true, NOW(), NOW()),
        (gen_random_uuid(), 'paul.ruiz@company.com', 'Paul Ruiz', 'employee', dept_operations, 'EMP1031', '+1234567031', true, NOW(), NOW()),
        (gen_random_uuid(), 'sandra.diaz@company.com', 'Sandra Diaz', 'employee', dept_operations, 'EMP1032', '+1234567032', true, NOW(), NOW());

    -- Insert Sales Department employees (8 employees)
    INSERT INTO profiles (id, email, full_name, role, department_id, employee_id, phone, is_active, created_at, updated_at)
    VALUES
        (gen_random_uuid(), 'andrew.vargas@company.com', 'Andrew Vargas', 'manager', dept_sales, 'EMP1033', '+1234567033', true, NOW(), NOW()),
        (gen_random_uuid(), 'ashley.castro@company.com', 'Ashley Castro', 'employee', dept_sales, 'EMP1034', '+1234567034', true, NOW(), NOW()),
        (gen_random_uuid(), 'joshua.mendoza@company.com', 'Joshua Mendoza', 'employee', dept_sales, 'EMP1035', '+1234567035', true, NOW(), NOW()),
        (gen_random_uuid(), 'kimberly.ramos@company.com', 'Kimberly Ramos', 'employee', dept_sales, 'EMP1036', '+1234567036', true, NOW(), NOW()),
        (gen_random_uuid(), 'kenneth.herrera@company.com', 'Kenneth Herrera', 'employee', dept_sales, 'EMP1037', '+1234567037', true, NOW(), NOW()),
        (gen_random_uuid(), 'donna.medina@company.com', 'Donna Medina', 'employee', dept_sales, 'EMP1038', '+1234567038', true, NOW(), NOW()),
        (gen_random_uuid(), 'kevin.aguilar@company.com', 'Kevin Aguilar', 'employee', dept_sales, 'EMP1039', '+1234567039', true, NOW(), NOW()),
        (gen_random_uuid(), 'carol.vega@company.com', 'Carol Vega', 'employee', dept_sales, 'EMP1040', '+1234567040', true, NOW(), NOW());

    -- Re-enable RLS for profiles table
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

    RAISE NOTICE 'Successfully added 40 employees across all departments';
END $$;

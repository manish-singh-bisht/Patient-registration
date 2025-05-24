export const patientSchema = `
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        date_of_birth DATE NOT NULL,
        gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zip_code VARCHAR(20) NOT NULL,

        emergency_contact_names TEXT[],
        emergency_contact_phones TEXT[],
        emergency_contact_relationships TEXT[],

        insurance_provider VARCHAR(200),
        insurance_policy_number VARCHAR(200),

        medical_record_number VARCHAR(50) UNIQUE,
        blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
        allergies TEXT,
        current_medications TEXT,
        medical_history TEXT,

        preferred_language VARCHAR(50) DEFAULT 'English',

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        is_active BOOLEAN DEFAULT true
`;

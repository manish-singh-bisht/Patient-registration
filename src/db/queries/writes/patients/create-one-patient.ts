export const createOnePatientWriteQuery = `
  INSERT INTO patient (
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    email,
    address,
    city,
    state,
    zip_code,
    emergency_contact_names,
    emergency_contact_phones,
    emergency_contact_relationships,
    insurance_provider,
    insurance_policy_number,
    medical_record_number,
    blood_type,
    allergies,
    current_medications,
    medical_history,
    preferred_language,
    is_active
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
    $21, $22
  )
  RETURNING id;
`;

// this is a bad decision for pagination if there are lot of rows
// we can rather do a cursor based, but since this app will never have a lot of users, we should be fine with offset based pagination

export const getAllPatientsReadQuery = `
  SELECT 
    id,
    first_name,
    last_name,
    date_of_birth,
    phone,
    email,
    city,
    state,
    emergency_contact_names,
    emergency_contact_phones,
    emergency_contact_relationships,
    insurance_provider,
    insurance_policy_number,
    medical_record_number,
    blood_type,
    allergies,
    preferred_language,
    created_at,
    updated_at
  FROM patient
  WHERE is_active = true
  ORDER BY created_at DESC
  LIMIT $1 OFFSET $2;
`;

export const getTotalPatientsCountQuery = `
  SELECT COUNT(*) as total_count
  FROM patient
  WHERE is_active = true;
`;

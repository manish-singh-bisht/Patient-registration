// this is a bad decision for pagination if there are lot of rows
// we can rather do a cursor based, but since this app will never have a lot of users, we should be fine with offset based pagination
export const getAllPatientsReadQuery = `
  SELECT *
  FROM patient
  ORDER BY created_at DESC
  LIMIT $1 OFFSET $2;
`;

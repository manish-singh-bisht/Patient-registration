import { useState, type ChangeEvent, useRef, useEffect } from "react";
import { X, Plus, Trash2, AlertCircle } from "lucide-react";

import { AutoResizeTextArea } from "../auto-resizing-textarea";
import {
  BLOOD_TYPES,
  BloodTypeSchema,
  CreatePatientInputSchema,
  GENDERS,
  GenderSchema,
  type BloodType,
  type Gender,
} from "../../db/handlers/types/patient/create-patient";
import { createOnePatient } from "../../db/handlers/patients/create-one-patient";
import { normalizeEmptyString } from "../../utils";

interface PatientFormData {
  first_name: string;
  last_name?: string;
  date_of_birth: string;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_names?: string[];
  emergency_contact_phones?: string[];
  emergency_contact_relationships?: string[];
  insurance_provider?: string;
  insurance_policy_number?: string;
  medical_record_number?: string;
  blood_type?: BloodType;
  allergies?: string;
  current_medications?: string;
  medical_history?: string;
  family_history?: string;
  preferred_language: string;
  is_active: boolean;
}

interface ValidationErrors {
  [key: string]: string | null;
}

interface FormState {
  data: PatientFormData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  submitError: string | null;
}

interface AddPatientDialogProps {
  showDialog: boolean;
  onClose: () => void;
}

export const AddPatientDialog = ({
  showDialog,
  onClose,
}: AddPatientDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const [formState, setFormState] = useState<FormState>({
    data: {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: GenderSchema.Values.male,
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      emergency_contact_names: [""],
      emergency_contact_phones: [""],
      emergency_contact_relationships: [""],
      blood_type: BloodTypeSchema.Enum["A+"],
      preferred_language: "English",
      is_active: true,
    },
    errors: {},
    isSubmitting: false,
    submitError: null,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (showDialog) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showDialog, onClose]);

  if (!showDialog) {
    return null;
  }

  const handleInputChange = ({
    field,
    value,
  }: {
    field: keyof PatientFormData;
    value: string | boolean;
  }): void => {
    setFormState((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        [field]: value,
      },
      errors: prevState.errors[field]
        ? {
            ...prevState.errors,
            [field]: null,
          }
        : prevState.errors,

      submitError: null,
    }));
  };

  const handleEmergencyContactChange = ({
    index,
    field,
    value,
  }: {
    index: number;
    field:
      | "emergency_contact_names"
      | "emergency_contact_phones"
      | "emergency_contact_relationships";
    value: string;
  }): void => {
    setFormState((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        [field]:
          prevState.data[field]?.map((item: string, i: number) =>
            i === index ? value : item
          ) ?? [],
      },

      submitError: null,
    }));
  };

  const addEmergencyContact = (): void => {
    setFormState((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        emergency_contact_names: [
          ...(prevState.data.emergency_contact_names ?? []),
          "",
        ],
        emergency_contact_phones: [
          ...(prevState.data.emergency_contact_phones ?? []),
          "",
        ],
        emergency_contact_relationships: [
          ...(prevState.data.emergency_contact_relationships ?? []),
          "",
        ],
      },
    }));
  };

  const removeEmergencyContact = ({ index }: { index: number }): void => {
    if ((formState.data.emergency_contact_names?.length ?? 0) > 1) {
      setFormState((prevState) => ({
        ...prevState,
        data: {
          ...prevState.data,
          emergency_contact_names:
            prevState.data.emergency_contact_names?.filter(
              (_: string, i: number) => i !== index
            ),
          emergency_contact_phones:
            prevState.data.emergency_contact_phones?.filter(
              (_: string, i: number) => i !== index
            ),
          emergency_contact_relationships:
            prevState.data.emergency_contact_relationships?.filter(
              (_: string, i: number) => i !== index
            ),
        },
      }));
    }
  };

  const validateForm = (): boolean => {
    const result = CreatePatientInputSchema.safeParse(formState.data);
    if (!result.success) {
      const validationErrors: ValidationErrors = {};
      result.error?.errors.forEach((error) => {
        const path: string = error.path.join(".");
        validationErrors[path] = error.message;
      });
      setFormState((prevState) => ({
        ...prevState,
        errors: validationErrors,
      }));
      return false;
    }
    setFormState((prevState) => ({
      ...prevState,
      errors: {},
    }));
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      console.log("invalid form data", formState.errors);
      return;
    }

    setFormState((prevState) => ({
      ...prevState,
      isSubmitting: true,
      submitError: null,
    }));

    try {
      const submitData = {
        ...formState.data,
        last_name: normalizeEmptyString({ value: formState.data.last_name }),
        insurance_provider: normalizeEmptyString({
          value: formState.data.insurance_provider,
        }),
        insurance_policy_number: normalizeEmptyString({
          value: formState.data.insurance_policy_number,
        }),
        medical_record_number: normalizeEmptyString({
          value: formState.data.medical_record_number,
        }),
        blood_type: formState.data.blood_type,
        allergies: normalizeEmptyString({ value: formState.data.allergies }),
        current_medications: normalizeEmptyString({
          value: formState.data.current_medications,
        }),
        medical_history: normalizeEmptyString({
          value: formState.data.medical_history,
        }),
        family_history: normalizeEmptyString({
          value: formState.data.family_history,
        }),
        preferred_language: formState.data.preferred_language,
      } satisfies PatientFormData;

      const filteredNames = formState.data.emergency_contact_names?.filter(
        (name) => name.trim()
      );
      const filteredPhones = formState.data.emergency_contact_phones?.filter(
        (phone) => phone.trim()
      );
      const filteredRelationships =
        formState.data.emergency_contact_relationships?.filter((rel) =>
          rel.trim()
        );

      if (filteredNames && filteredNames.length > 0) {
        submitData.emergency_contact_names = filteredNames;
        submitData.emergency_contact_phones = filteredPhones;
        submitData.emergency_contact_relationships = filteredRelationships;
      }

      await createOnePatient({ input: submitData });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorMessage =
        "An unexpected error occurred while creating the patient.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = String(error.message);
      }

      setFormState((prevState) => ({
        ...prevState,
        submitError: errorMessage,
      }));
    } finally {
      setFormState((prevState) => ({
        ...prevState,
        isSubmitting: false,
      }));
    }
  };

  const handleTextInputChange =
    ({ field }: { field: keyof PatientFormData }) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      handleInputChange({ field, value: event.target.value });
    };

  const handleTextAreaChange =
    ({ field }: { field: keyof PatientFormData }) =>
    (event: ChangeEvent<HTMLTextAreaElement>): void => {
      handleInputChange({ field, value: event.target.value });
    };

  const handleSelectChange =
    ({ field }: { field: keyof PatientFormData }) =>
    (event: ChangeEvent<HTMLSelectElement>): void => {
      handleInputChange({ field, value: event.target.value });
    };

  const handleCheckboxChange =
    ({ field }: { field: keyof PatientFormData }) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      handleInputChange({ field, value: event.target.checked });
    };

  const handleEmergencyContactInputChange =
    ({
      index,
      field,
    }: {
      index: number;
      field:
        | "emergency_contact_names"
        | "emergency_contact_phones"
        | "emergency_contact_relationships";
    }) =>
    (event: ChangeEvent<HTMLInputElement>): void => {
      handleEmergencyContactChange({ index, field, value: event.target.value });
    };

  const { data: formData, errors, isSubmitting, submitError } = formState;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold text-gray-900">
            Register New Patient
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitError && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">
                Error Submitting Form
              </h4>
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 border-b pb-2">
              Personal Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={handleTextInputChange({ field: "first_name" })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.first_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={handleTextInputChange({ field: "last_name" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleTextInputChange({ field: "date_of_birth" })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.date_of_birth ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date_of_birth && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.date_of_birth}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={handleSelectChange({ field: "gender" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {GENDERS.map((gender: string) => (
                    <option key={gender} value={gender}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Contact Information */}
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 border-b pb-2">
              Contact Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleTextInputChange({ field: "phone" })}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleTextInputChange({ field: "email" })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <AutoResizeTextArea
                value={formData.address}
                onChange={handleTextAreaChange({ field: "address" })}
                placeholder="Street address"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
                maxHeight={80}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={handleTextInputChange({ field: "city" })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={handleTextInputChange({ field: "state" })}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.state ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code *
                </label>
                <input
                  type="text"
                  value={formData.zip_code}
                  onChange={handleTextInputChange({ field: "zip_code" })}
                  placeholder="12345 or 12345-6789"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.zip_code ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.zip_code && (
                  <p className="text-red-500 text-xs mt-1">{errors.zip_code}</p>
                )}
              </div>
            </div>
          </div>
          {/* Emergency Contacts */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium text-gray-900 border-b pb-2">
                Emergency Contacts
              </div>
              <button
                type="button"
                onClick={addEmergencyContact}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Contact
              </button>
            </div>
            {(formData.emergency_contact_names ?? [""]).map(
              (_: string, index: number) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-3 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Emergency Contact {index + 1}
                    </span>
                    {(formData.emergency_contact_names?.length ?? 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmergencyContact({ index })}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.emergency_contact_names?.[index]}
                        onChange={handleEmergencyContactInputChange({
                          index,
                          field: "emergency_contact_names",
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.emergency_contact_phones?.[index]}
                        onChange={handleEmergencyContactInputChange({
                          index,
                          field: "emergency_contact_phones",
                        })}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        value={
                          formData.emergency_contact_relationships?.[index] ??
                          ""
                        }
                        onChange={handleEmergencyContactInputChange({
                          index,
                          field: "emergency_contact_relationships",
                        })}
                        placeholder="e.g., Spouse, Parent, Sibling"
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          {/* Insurance Information */}
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 border-b pb-2">
              Insurance Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={formData.insurance_provider}
                  onChange={handleTextInputChange({
                    field: "insurance_provider",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Number
                </label>
                <input
                  type="text"
                  value={formData.insurance_policy_number}
                  onChange={handleTextInputChange({
                    field: "insurance_policy_number",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          {/* Medical Information */}
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 border-b pb-2">
              Medical Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Record Number
                </label>
                <input
                  type="text"
                  value={formData.medical_record_number}
                  onChange={handleTextInputChange({
                    field: "medical_record_number",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <select
                  value={formData.blood_type ?? BloodTypeSchema.enum["A+"]}
                  onChange={handleSelectChange({ field: "blood_type" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select blood type</option>
                  {BLOOD_TYPES.map((type: string) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Allergies
              </label>
              <AutoResizeTextArea
                value={formData.allergies}
                onChange={handleTextAreaChange({ field: "allergies" })}
                placeholder="List any known allergies..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxHeight={120}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Medications
              </label>
              <AutoResizeTextArea
                value={formData.current_medications}
                onChange={handleTextAreaChange({
                  field: "current_medications",
                })}
                placeholder="List current medications and dosages..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxHeight={120}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical History
              </label>
              <AutoResizeTextArea
                value={formData.medical_history}
                onChange={handleTextAreaChange({ field: "medical_history" })}
                placeholder="Previous medical conditions, surgeries, etc..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxHeight={150}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family History
              </label>
              <AutoResizeTextArea
                value={formData.family_history}
                onChange={handleTextAreaChange({ field: "family_history" })}
                placeholder="Family medical history..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxHeight={150}
              />
            </div>
          </div>
          {/* Preferences */}
          <div className="space-y-4">
            <div className="text-lg font-medium text-gray-900 border-b pb-2">
              Preferences
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Language
                </label>
                <input
                  type="text"
                  value={formData.preferred_language}
                  onChange={handleTextInputChange({
                    field: "preferred_language",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active ?? false}
                  onChange={handleCheckboxChange({ field: "is_active" })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active Patient
                </label>
              </div>
            </div>
          </div>
          {/* Form Actions */}
          <div className="flex justify-end items-center space-x-3 pt-6 border-t">
            <div className="text-red-500 ">
              {submitError &&
                "Some errors while submitting, scroll up to see the errors"}
              {Object.keys(formState.errors).length > 0 &&
                "Some errors in form, scroll up and resolve errors"}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Patient"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export type AddressLabel = "HOME" | "WORK" | "OTHER";

export interface Address {
  id: number;
  label: AddressLabel;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressRequest {
  label?: AddressLabel;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

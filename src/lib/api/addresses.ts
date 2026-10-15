import { apiClient } from "@/lib/api-client";
import type { Address, AddressRequest } from "@/types/address";

export const addressesApi = {
  async getAddresses(): Promise<Address[]> {
    const res = await apiClient.get<{ data: Address[] }>("/users/me/addresses");
    return res.data.data;
  },

  async getAddressById(id: number): Promise<Address> {
    const res = await apiClient.get<{ data: Address }>(`/users/me/addresses/${id}`);
    return res.data.data;
  },

  async createAddress(data: AddressRequest): Promise<Address> {
    const res = await apiClient.post<{ data: Address }>("/users/me/addresses", data);
    return res.data.data;
  },

  async updateAddress(id: number, data: AddressRequest): Promise<Address> {
    const res = await apiClient.put<{ data: Address }>(`/users/me/addresses/${id}`, data);
    return res.data.data;
  },

  async deleteAddress(id: number): Promise<void> {
    await apiClient.delete(`/users/me/addresses/${id}`);
  },

  async setDefaultAddress(id: number): Promise<Address> {
    const res = await apiClient.patch<{ data: Address }>(`/users/me/addresses/${id}/default`);
    return res.data.data;
  },
};

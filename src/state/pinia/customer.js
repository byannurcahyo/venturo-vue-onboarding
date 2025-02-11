import { defineStore } from "pinia";
import axios from "axios";

export const useCustomerStore = defineStore("customer", {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL || "http://127.0.0.1:8000",
        customers: [],
        customer: null,
        response: {
            status: null,
            message: null,
            error: [],
        },
        modalAction: {
            action: "",
            modal_title: "",
            modal_button: "",
        },
        totalData: 0,
        current: 1,
        perPage: 5,
        searchQuery: "",
    }),

    actions: {
        openForm(newAction, customer) {
            this.modalAction.action = newAction;
            this.customer = customer;
        },
        async getCustomers() {
            try {
                const url = `${this.apiUrl}/api/v1/customers?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const customersDataList = res.data.data;
                this.customers = customersDataList;
                this.totalData = res.data.meta.total;
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                };
            }
        },

        async changePage(newPage) {
            this.current = newPage;
            await this.getCustomers();
        },
        async searchCustomer(query) {
            this.searchQuery = query;
            this.current = 1;
            await this.getCustomers();
        },
        async addCustomer(customers) {
            try {
                const res = await axios.post(
                    `${this.apiUrl}/api/v1/customers`,
                    customers,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                this.response = {
                    status: res.status,
                    message: res.data.message,
                };
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            } finally {
                await this.getCustomers();
            }
        },
        async deleteCustomer(id) {
            this.loading = true;
            try {
                await axios.delete(`${this.apiUrl}/api/v1/customers/${id}`);
                this.response = {
                    status: "200",
                };
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            } finally {
                this.getCustomers();
            }
        },
        async updateCustomer(id, customers) {
            try {
                await axios.put(
                    `${this.apiUrl}/api/v1/customers/${id}`,
                    customers,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                this.response = {
                    status: 200,
                    message: "Customer updated successfully",
                };
            } catch (error) {
                console.error("Error Response:", error.response);
                this.response = {
                    status: error.status,
                    message: error.message,
                };
            }
        },
        resetState() {
            this.customers = [];
            this.customer = null;
            this.response = {
                status: null,
                message: null,
                error: [],
            };
            this.modalAction = {
                action: "",
                modal_title: "",
                modal_button: "",
            };
            this.totalData = 0;
            this.current = 1;
            this.searchQuery = "";
        },
    },
});

import { defineStore } from "pinia";
import axios from "axios";

export const useProductCategoryStore = defineStore("category", {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL || "http://127.0.0.1:8000",
        categories: [],
        category: null,
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
        openForm(newAction, category) {
            this.modalAction.action = newAction;
            this.category = category;
        },
        async getCategories() {
            try {
                const url = `${this.apiUrl}/api/v1/categories?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const categoriesDataList = res.data.data;
                this.categories = categoriesDataList;
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
            await this.getCategories();
        },
        async searchCategory(query) {
            this.searchQuery = query;
            this.current = 1;
            await this.getCategories();
        },
        async addCategory(category) {
            try {
                const res = await axios.post(
                    `${this.apiUrl}/api/v1/categories`,
                    category,
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
                this.error = {
                    status: error.response?.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            } finally {
                await this.getCategories();
            }
        },
        async deleteCategory(id) {
            this.loading = true;
            try {
                await axios.delete(`${this.apiUrl}/api/v1/categories/${id}`);
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
                this.getCategories();
            }
        },
        async updateCategory(id, category) {
            try {
                await axios.put(
                    `${this.apiUrl}/api/v1/categories/${id}`,
                    category,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                this.response = {
                    status: 200,
                    message: "Category updated successfully",
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
            this.categories = [];
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

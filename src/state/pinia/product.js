import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore("product", {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL,
        products: [],
        productById: "",
        response: {
            status: null,
            message: null,
            error: [],
        },
        formAction: {
            action: "",
            form_title: "",
            form_button: "",
        },
        totalData: 0,
        current: 1,
        perpage: 10,
        searchQuery: "",
        maxImageSize: 3 * 1024 * 1024,
    }),

    actions: {
        openForm(newAction, product) {
            this.formAction.action = newAction;
            this.product = product;
        },
        async getProducts() {
            try {
                const url = `${this.apiUrl}/api/v1/products?page=${this.current}&per_page=${this.perpage}&name=${this.searchQuery}`;
                const res = await axios.get(url);
                const productsDataList = res.data.data;
                this.products = productsDataList;
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
            await this.getProducts();
        },

        async searchProduct(query) {
            this.searchQuery = query;
            this.current = 1;
            await this.getProducts();
        },

        async addProduct(product) {
            try {
                const res = await axios.post(
                    `${this.apiUrl}/api/v1/products`,
                    product,
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
                    status: error.response.status,
                    message: error.message,
                    list: error.response.data.errors,
                };
            } finally {
                await this.getProducts();
            }
        },

        async deleteProduct(id) {
            this.loading = true;
            try {
                await axios.delete(`${this.apiUrl}/api/v1/products/${id}`);
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
                this.getProducts();
            }
        },

        async updateProduct(id, product) {
            try {
                await axios.put(
                    `${this.apiUrl}/api/v1/products/${id}`,
                    product,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                this.response = {
                    status: 200,
                    message: "Product updated successfully",
                };
            } catch (error) {
                this.response = {
                    status: error.status,
                    message: error.message,
                };
            }
        },

        async getProductById(id) {
            try {
                const res = await axios.get(
                    `${this.apiUrl}/api/v1/products/${id}`
                );
                this.productById = res.data.data;
            } catch (error) {
                this.response = {
                    status: error.response?.status,
                    message: error.message,
                };
            }
        },

        resetState() {
            this.products = [];
            this.productById = "";
            this.response = {
                status: null,
                message: null,
                error: [],
            };
            this.modalAction = {
                action: "",
                form_title: "",
                form_button: "",
            };
            this.totalData = 0;
            this.current = 1;
            this.searchQuery = "";
        },
    },
});

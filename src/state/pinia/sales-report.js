import { defineStore } from "pinia";
import axios from "axios";

export const useSalesReportStore = defineStore("report", {
    state: () => ({
        apiUrl: process.env.VUE_APP_APIURL,
        reports: [],
        response: {
            status: null,
            message: null,
            data: null,
        },
        errorResponse: {
            status: null,
            message: null,
            list: [],
        },
        totalData: 0,
        current: 1,
        perpage: 10,
        searchQuery: "",
        categoryId: "",
    }),

    actions: {
        async getReports() {
            try {
                const url = `${this.apiUrl}/api/v1/report/sales-menu?page=${this.current}&per_page=${this.perpage}&date_from=${this.startDate}&date_to=${this.endDate}&category_id=${this.categoryId}`;
                const res = await axios.get(url);
                this.reports = res.data.data;
                this.totalData = res.data.total;
                this.response = {
                    status: res.status,
                    message: "Reports fetched successfully.",
                    data: res.data.data,
                };
            } catch (error) {
                this.errorResponse = {
                    status: error.response?.status || 500,
                    message:
                        error.response?.data?.message ||
                        "Failed to fetch reports.",
                    list: error.response?.data?.errors || [],
                };
                throw this.errorResponse;
            }
        },

        async exportExcel() {
            const params = new URLSearchParams({
                is_export_excel: true,
            });
            try {
                const response = await axios
                    .get(`${this.apiUrl}/api/v1/report/sales-menu`, {
                        params,
                        responseType: "blob",
                    })
                    .then((response) => {
                        const url = URL.createObjectURL(response.data);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = "report-sales-category.xls";
                        document.body.appendChild(link);
                        link.click();
                    });
                return response;
            } catch (error) {
                this.error = {
                    status: error.response?.status || 500,
                    message: error.message,
                    list: error.response?.data?.errors || [],
                };
            }
        },
    },
});

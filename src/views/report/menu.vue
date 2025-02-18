<template>
    <Layouts>
        <PageHeader title="Menu Sales Report" pageTitle="Report" />
        <BCard>
            <BCardHeader>
                <BCol
                    md="3"
                    class="d-flex justify-content-end align-items-end ms-auto"
                >
                    <BButton variant="primary" @click="exportExcel">
                        <i class="mdi mdi-file-excel" />
                        Export Excel
                    </BButton>
                </BCol>
            </BCardHeader>

            <BCardBody>
                <div style="overflow-x: auto">
                    <BTableSimple bordered class="table-sm">
                        <BThead>
                            <BTr>
                                <BTh :colspan="daysInMonth" class="text-center">
                                    {{ currentMonth }} {{ currentYear }}
                                </BTh>
                            </BTr>
                            <BTr>
                                <BTh scope="col" class="text-center">Menu</BTh>
                                <BTh
                                    v-for="day in daysInMonth"
                                    :key="day"
                                    class="text-center"
                                    >{{ day }}</BTh
                                >
                                <BTh class="text-center">Total</BTh>
                            </BTr>
                        </BThead>
                        <BTbody>
                            <BTr v-if="rows.length === 0">
                                <BTd
                                    colspan="daysInMonth + 2"
                                    class="text-center"
                                >
                                    Tidak ada data
                                </BTd>
                            </BTr>
                            <template
                                v-for="sale in rows"
                                :key="sale.category_id"
                            >
                                <template
                                    v-for="product in sale.products"
                                    :key="product.product_id"
                                >
                                    <BTr>
                                        <BTd class="text-center">{{
                                            product.product_name
                                        }}</BTd>
                                        <BTd
                                            v-for="day in daysInMonth"
                                            :key="day"
                                            class="text-center"
                                        >
                                            {{
                                                (() => {
                                                    const total =
                                                        product.transactions.reduce(
                                                            (
                                                                sum,
                                                                transaction
                                                            ) => {
                                                                const transactionDate =
                                                                    new Date(
                                                                        transaction.date_transaction
                                                                    );
                                                                return transactionDate.getDate() ===
                                                                    day
                                                                    ? sum +
                                                                          transaction.total_sales
                                                                    : sum;
                                                            },
                                                            0
                                                        );
                                                    return total > 0
                                                        ? total
                                                        : "";
                                                })()
                                            }}
                                        </BTd>
                                        <BTd class="text-center fw-bold">
                                            {{
                                                product.transactions.reduce(
                                                    (sum, transaction) =>
                                                        sum +
                                                        transaction.total_sales,
                                                    0
                                                )
                                            }}
                                        </BTd>
                                    </BTr>
                                </template>
                            </template>
                        </BTbody>
                    </BTableSimple>
                </div>
            </BCardBody>
        </BCard>
    </Layouts>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
    useProductCategoryStore,
    useSalesReportStore,
} from "../../state/pinia";
import { useProgress } from "@/helpers/progress";
import PageHeader from "../../components/page-header.vue";
import Layouts from "../../layouts/main.vue";

const { startProgress, finishProgress, failProgress } = useProgress();
const reportStore = useSalesReportStore();
const categoryStore = useProductCategoryStore();
const currentYear = new Date().getFullYear();
const currentMonth = new Date().toLocaleString("default", { month: "long" });
const daysInMonth = new Date(
    currentYear,
    new Date().getMonth() + 1,
    0
).getDate();
const rows = ref([]);
const categories = ref([]);

const getReports = async () => {
    startProgress();
    try {
        await reportStore.getReports();
        rows.value = reportStore.reports || [];
        finishProgress();
    } catch (error) {
        rows.value = [];
        failProgress();
    }
};

const getCategories = async () => {
    startProgress();
    await categoryStore.getCategories();
    if (categoryStore.categories) {
        finishProgress();
        categories.value =
            categoryStore.categories.map((category) => ({
                id: category.id,
                name: category.name,
            })) || [];
    } else {
        failProgress();
        categories.value = [];
    }
};

const exportExcel = async () => {
    startProgress();
    try {
        await reportStore.exportExcel();
        finishProgress();
    } catch (error) {
        failProgress();
    }
};

onMounted(async () => {
    await getCategories();
    await getReports();
});
</script>

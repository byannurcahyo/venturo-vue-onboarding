<template>
    <Layout>
        <BRow class="g-4">
            <BCol lg="7">
                <BRow class="mb-3 align-items-center">
                    <!-- Pilih customer -->
                    <BCol md="4">
                        <BFormSelect
                            v-model="formModel.m_customer_id"
                            @change="updateCustomerName"
                        >
                            <BFormSelectOption :value="''" disabled
                                >Pilih Customer</BFormSelectOption
                            >
                            <BFormSelectOption
                                v-for="customer in rowsCustomer"
                                :key="customer.id"
                                :value="customer.id"
                            >
                                {{ customer.name }}
                            </BFormSelectOption>
                        </BFormSelect>
                        <template v-if="errorList?.m_customer_id">
                            <div
                                class="invalid-feedback"
                                v-for="(err, index) in errorList.m_customer_id"
                                :key="index"
                            >
                                {{ err }}
                            </div>
                        </template>
                    </BCol>
                    <BCol md="8">
                        <BInputGroup>
                            <BFormInput
                                v-model="productStore.searchQuery"
                                placeholder="Search for..."
                                @keydown.enter="searchData"
                            />
                            <BInputGroupAppend>
                                <BButton
                                    variant="btn btn-primary me-1"
                                    @click="searchData"
                                >
                                    <i class="mdi mdi-magnify"></i>
                                </BButton>
                                <BButton
                                    variant="btn btn-light me-1"
                                    @click="refresh"
                                >
                                    <i class="mdi mdi-refresh"></i>
                                </BButton>
                            </BInputGroupAppend>
                        </BInputGroup>
                    </BCol>
                </BRow>
                <BCard
                    class="shadow-sm"
                    style="border-top: 5px solid var(--bs-primary)"
                >
                    <BCardBody>
                        <BRow>
                            <BCol
                                lg="4"
                                md="6"
                                v-for="product in rowsProduct"
                                :key="product.id"
                            >
                                <BCard
                                    class="product-card"
                                    @click="addToOrder(product)"
                                >
                                    <BImg
                                        :src="product.photo_url"
                                        class="card-img-top"
                                    />
                                    <BCardBody class="text-center">
                                        <p class="card-title">
                                            {{ product.name }}
                                        </p>
                                        <p
                                            class="card-text fw-bold fs-6 text-primary"
                                        >
                                            Rp
                                            {{ product.price.toLocaleString() }}
                                        </p>
                                    </BCardBody>
                                </BCard>
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
            <BCol lg="5">
                <BCard class="shadow-sm">
                    <BCardBody>
                        <h5 class="mb-1">Detail Transaction</h5>
                        <p class="mb-3 fw-bolder fs-2 text-primary">
                            {{ selectedCustomerName }}
                        </p>
                        <div
                            v-for="order in orders"
                            :key="order.id"
                            class="order-item d-flex align-items-center mb-3"
                        >
                            <BImg
                                :src="order.photo_url"
                                :alt="order.name"
                                class="rounded me-3"
                                height="80"
                                width="80"
                            />
                            <div>
                                <h6 class="mb-1 fs-5 fw-semibold">
                                    {{ order.name }}
                                </h6>
                                <h6 class="text-primary">
                                    Rp {{ order.price.toLocaleString() }}
                                </h6>
                            </div>
                            <BButton
                                class="btn btn-sm btn-soft-danger ms-auto d-flex align-items-center"
                                @click="decreaseQuantity(order.id)"
                            >
                                <i class="mdi mdi-minus"></i>
                            </BButton>
                            <h5
                                class="text-black fw-bold mx-2 my-0 d-flex align-items-center justify-content-center"
                                style="width: 40px; height: 40px"
                            >
                                {{ order.quantity }}
                            </h5>
                            <BButton
                                class="btn btn-sm btn-soft-info"
                                @click="increaseQuantity(order.id)"
                            >
                                <i class="mdi mdi-plus"></i>
                            </BButton>
                        </div>
                        <div class="payment-summary">
                            <div class="d-flex justify-content-between">
                                <span>Subtotal</span>
                                <span>Rp {{ subtotal.toLocaleString() }}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span>Tax 11%</span>
                                <span>Rp {{ tax.toLocaleString() }}</span>
                            </div>
                            <div
                                class="d-flex justify-content-between fw-bold fs-4"
                            >
                                <span>Total</span>
                                <span>Rp {{ total.toLocaleString() }}</span>
                            </div>
                        </div>
                        <BButton
                            variant="primary"
                            class="w-100 mt-3"
                            @click="handleOrderSubmit"
                        >
                            <i class="mdi mdi-plus"></i> Add Transaction
                        </BButton>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import {
    useProductStore,
    useCustomerStore,
    useSalesStore,
} from "../../state/pinia";
import { useProgress } from "@/helpers/progress";
import { BButton } from "bootstrap-vue-next";
import { showSuccessToast, showErrorToast } from "@/helpers/alert.js";
import Layout from "../../layouts/main";

const { startProgress, finishProgress, failProgress } = useProgress();
const productStore = useProductStore();
const customerStore = useCustomerStore();
const salesStore = useSalesStore();
const orders = ref([]);
const subtotal = computed(() =>
    orders.value.reduce((sum, order) => sum + order.price * order.quantity, 0)
);
const tax = computed(() => subtotal.value * 0.11);
const total = computed(() => subtotal.value + tax.value);

const errorList = computed(() => customerStore.response?.list || {});
const rowsProduct = ref([]);
const rowsCustomer = ref([]);
const selectedCustomerName = ref("");
const formModel = reactive({
    m_customer_id: "",
    product_detail: [],
});

const getCustomers = async () => {
    try {
        startProgress();
        await customerStore.getCustomers();
        if (customerStore.customers) {
            finishProgress();
            rowsCustomer.value = customerStore.customers || [];
        } else {
            failProgress();
            rowsCustomer.value = [];
        }
    } catch (error) {
        showErrorToast("Cannot get customers");
        rowsCustomer.value = [];
    }
};

const getProducts = async () => {
    try {
        startProgress();
        await productStore.getProducts();
        if (productStore.products) {
            finishProgress();
            rowsProduct.value = productStore.products || [];
        } else {
            failProgress();
            rowsProduct.value = [];
        }
    } catch (error) {
        showErrorToast("Cannot get products");
        rowsProduct.value = [];
    }
};

const searchData = async () => {
    await productStore.changePage(1);
    await getProducts();
};

const refresh = async () => {
    productStore.searchQuery = "";
    await getProducts();
};

const updateCustomerName = () => {
    const customer = rowsCustomer.value.find(
        (customer) => customer.id === formModel.m_customer_id
    );
    if (customer) {
        selectedCustomerName.value = customer.name;
    }
};

const addToOrder = (product) => {
    const existingOrder = orders.value.find((order) => order.id === product.id);
    if (existingOrder) {
        existingOrder.quantity++;
    } else {
        const newOrder = {
            id: product.id,
            name: product.name,
            photo_url: product.photo_url,
            price: product.price,
            quantity: 1,
            details: product.details || [],
        };
        orders.value.push(newOrder);
    }
    formModel.product_detail = orders.value.flatMap((order) => {
        return order.details.map((detail) => ({
            m_product_id: order.id,
            m_product_detail_id: detail.id,
            total_item: order.quantity,
            price: order.price,
        }));
    });
};

const increaseQuantity = (id) => {
    const order = orders.value.find((order) => order.id === id);
    if (order) {
        order.quantity++;
    }
};

const decreaseQuantity = (id) => {
    const order = orders.value.find((order) => order.id === id);
    if (order && order.quantity > 1) {
        order.quantity--;
    } else {
        orders.value = orders.value.filter((order) => order.id !== id);
    }
};

const handleOrderSubmit = async () => {
    if (!formModel.m_customer_id) {
        showErrorToast("Please select a customer.");
        return;
    }
    const getRandomDetailId = (product) => {
        if (product.details && product.details.length > 0) {
            const randomIndex = Math.floor(
                Math.random() * product.details.length
            );
            return product.details[randomIndex].id;
        }
        return null;
    };
    const orderData = {
        m_customer_id: formModel.m_customer_id,
        product_detail: orders.value
            .map((order) => ({
                m_product_id: order.id,
                m_product_detail_id: getRandomDetailId(order),
                total_item: order.quantity,
                price: order.price,
            }))
            .filter((order) => order.m_product_detail_id !== null),
    };
    if (orderData.product_detail.length === 0) {
        showErrorToast("No valid product details to submit.");
        return;
    }
    try {
        startProgress();
        await salesStore.submitOrder(orderData);
        if (salesStore.response?.status === 200) {
            finishProgress();
            showSuccessToast("Transaction submitted successfully!");
            formModel.m_customer_id = "";
            formModel.product_detail = [];
            orders.value = [];
            selectedCustomerName.value = "";
            await getProducts();
        } else {
            failProgress();
            showErrorToast(
                salesStore.response?.message || "Failed to submit transaction."
            );
        }
    } catch (error) {
        showErrorToast("Failed to submit transaction.");
        failProgress();
    }
};

onMounted(async () => {
    await getProducts();
    await getCustomers();
});
</script>

<style scoped>
.product-card {
    border: 1px solid #fafafa;
    border-radius: 8px;
}

.payment-summary div {
    margin-bottom: 8px;
}
</style>

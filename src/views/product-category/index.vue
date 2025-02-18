<template>
    <Layout>
        <PageHeader
            title="Product Categories List"
            pageTitle="Product Categories"
        />
        <BRow>
            <BCol lg="12">
                <BCard no-body>
                    <BCardBody class="border-bottom">
                        <div class="d-flex align-items-center">
                            <BCardTitle class="mb-0 flex-grow-1"
                                >Product Category</BCardTitle
                            >
                            <div class="flex-shrink-0">
                                <BButton
                                    class="btn btn-primary me-1"
                                    @click="openFormModal('add', null)"
                                    >Add Category
                                </BButton>
                                <BModal
                                    v-model="isOpenForm"
                                    size="lg"
                                    id="modal-standard"
                                    :title="modalTitle"
                                    title-class="font-18"
                                    ok-title="Simpan"
                                    @ok="saveCategory"
                                    @hide.prevent
                                    @cancel="
                                        isOpenForm = false;
                                        productCategoryStore.resetState();
                                        getCategories();
                                    "
                                    @close="
                                        isOpenForm = false;
                                        productCategoryStore.resetState();
                                        getCategories();
                                    "
                                >
                                    <BCol cols="12" class="mt-4">
                                        <BForm>
                                            <BRow class="mb-3">
                                                <label
                                                    class="col-md-2 col-form-label"
                                                    for="form-name"
                                                    >Name</label
                                                >
                                                <BCol md="10">
                                                    <input
                                                        class="form-control"
                                                        :class="{
                                                            'is-invalid': !!(
                                                                errorList &&
                                                                errorList.name
                                                            ),
                                                        }"
                                                        id="form-name"
                                                        placeholder="Masukkan Nama Kategori Produk"
                                                        v-model="formModel.name"
                                                    />
                                                    <template
                                                        v-if="
                                                            !!(
                                                                errorList &&
                                                                errorList.name
                                                            )
                                                        "
                                                    >
                                                        <div
                                                            class="invalid-feedback"
                                                            v-for="(
                                                                err, index
                                                            ) in errorList.name"
                                                            :key="index"
                                                        >
                                                            <span>{{
                                                                err
                                                            }}</span>
                                                        </div>
                                                    </template>
                                                </BCol>
                                            </BRow>
                                        </BForm>
                                    </BCol>
                                </BModal>
                                <BLink
                                    href="#!"
                                    class="btn btn-light me-1"
                                    @click="refresh"
                                    ><i class="mdi mdi-refresh"></i
                                ></BLink>
                            </div>
                        </div>
                    </BCardBody>
                    <BCardBody class="border-bottom">
                        <BRow class="g-3">
                            <BCol xxl="10" lg="8">
                                <BFormInput
                                    type="text"
                                    class="form-control search"
                                    placeholder="Search for ..."
                                    v-model="productCategoryStore.searchQuery"
                                    @keydown.enter="searchData"
                                />
                            </BCol>
                            <BCol xxl="2" lg="4">
                                <BButton
                                    variant="soft-secondary"
                                    @click="searchData"
                                    class="w-100"
                                >
                                    <i class="mdi mdi-magnify align-middle"></i>
                                    Search
                                </BButton>
                            </BCol>
                        </BRow>
                    </BCardBody>
                    <BCardBody>
                        <div class="table-responsive">
                            <BTableSimple>
                                <BThead>
                                    <BTr>
                                        <BTh scope="col">Name</BTh>
                                    </BTr>
                                </BThead>
                                <BTbody>
                                    <BTr
                                        v-for="categories in rows"
                                        :key="categories.id"
                                    >
                                        <BTd>{{ categories.name }}</BTd>
                                        <BTd>
                                            <ul
                                                class="list-unstyled hstack gap-1 mb-0 justify-content-end"
                                            >
                                                <li
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    aria-label="Edit"
                                                    @click="
                                                        openFormModal(
                                                            'edit',
                                                            categories.id
                                                        )
                                                    "
                                                >
                                                    <BButton
                                                        class="btn btn-sm btn-soft-info"
                                                        ><i
                                                            class="mdi mdi-pencil-outline"
                                                        ></i>
                                                    </BButton>
                                                </li>
                                                <li
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    aria-label="Delete"
                                                    @click="
                                                        deleteCategory(
                                                            categories.id
                                                        )
                                                    "
                                                >
                                                    <BButton
                                                        data-bs-toggle="modal"
                                                        class="btn btn-sm btn-soft-danger"
                                                    >
                                                        <i
                                                            class="mdi mdi-delete-outline"
                                                        ></i>
                                                    </BButton>
                                                </li>
                                            </ul>
                                        </BTd>
                                    </BTr>
                                </BTbody>
                            </BTableSimple>
                        </div>
                        <Pagination
                            :currentPage="productCategoryStore.current"
                            :totalRows="productCategoryStore.totalData"
                            :perPage="productCategoryStore.perpage"
                            @update:currentPage="updatePage"
                        />
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import { useProductCategoryStore } from "@/state/pinia";
import { useProgress } from "@/helpers/progress";
import { BLink } from "bootstrap-vue-next";
import {
    showSuccessToast,
    showErrorToast,
    showDeleteConfirmationDialog,
} from "@/helpers/alert.js";
import PageHeader from "@/components/page-header";
import Pagination from "@/components/widgets/pagination";
import Layout from "../../layouts/main";

const { startProgress, finishProgress, failProgress } = useProgress();
const productCategoryStore = useProductCategoryStore();
const statusCode = computed(() => productCategoryStore.response.status);
const errorList = computed(() => productCategoryStore.response?.list || {});
const errorMessage = computed(
    () => productCategoryStore.response?.message || ""
);
const isOpenForm = ref(false);
const modalTitle = ref(false);
const rows = ref([]);
const formModel = reactive({
    id: "",
    name: "",
});

const getCategories = async () => {
    startProgress();
    await productCategoryStore.getCategories();
    if (productCategoryStore.categories) {
        finishProgress();
        rows.value = productCategoryStore.categories || [];
    } else {
        failProgress();
        rows.value = [];
    }
};

const searchData = async () => {
    await productCategoryStore.changePage(1);
    await getCategories();
};

const refresh = async () => {
    productCategoryStore.searchQuery = "";
    await getCategories();
};

const updatePage = async (page) => {
    await productCategoryStore.changePage(page);
    await getCategories();
};

const deleteCategory = async (id) => {
    const confirmed = await showDeleteConfirmationDialog();
    if (confirmed) {
        try {
            await productCategoryStore.deleteCategory(id);
            showSuccessToast("Category deleted successfully");
            await getCategories();
        } catch (error) {
            showErrorToast("Failed to delete category");
        }
    }
};

const openFormModal = (mode, id = null) => {
    isOpenForm.value = true;
    if (mode === "edit" && id) {
        const category = rows.value.find((category) => category.id === id);
        if (category) {
            formModel.id = category.id;
            formModel.name = category.name;
            modalTitle.value = "Update Category";
        }
    } else {
        formModel.id = "";
        formModel.name = "";
        modalTitle.value = "Add Category";
    }
};

const saveCategory = async () => {
    try {
        if (formModel.id) {
            await productCategoryStore.updateCategory(formModel.id, formModel);
            if (statusCode.value != 200) {
                showErrorToast("Failed to update category", errorMessage.value);
            } else {
                isOpenForm.value = false;
                await getCategories();
                showSuccessToast("Category updated successfully!");
            }
        } else {
            await productCategoryStore.addCategory(formModel);
            if (statusCode.value != 200) {
                showErrorToast("Failed to add category", errorMessage.value);
            } else {
                isOpenForm.value = false;
                await getCategories();
                showSuccessToast("Category added successfully!");
            }
        }
    } catch (error) {
        showErrorToast("Failed to add category", errorMessage.value);
    }
};

onMounted(async () => {
    await getCategories();
});
</script>

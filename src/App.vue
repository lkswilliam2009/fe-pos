<template>
  <div class="page">
    <div class="container">

      <!-- Header -->
      <h1 class="title">Daftar Diskon</h1>

      <!-- Outlet -->
      <div class="outlet">
        <!-- DROPDOWN -->
        <div class="outlet-wrapper">
          <span class="outlet-icon">
            <!-- Shop Icon -->
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M16 6V4a4 4 0 0 0-8 0v2H4v2h1l1.6 10.4A2 2 0 0 0 8.6 20h6.8a2 2 0 0 0 2-1.6L19 8h1V6h-4z"
              />
            </svg>
          </span>

          <select
            class="outlet-input with-icon"
            v-model="selectedOutlet"
            @change="handleOutletChange"
          >
            <option value="kopi-anak-bangsa">Kopi Anak Bangsa</option>
            <option value="custom">Lainnya (Custom API)</option>
          </select>
        </div>

        <!-- CUSTOM API URL (SHOW / HIDE) -->
        <input
          v-if="selectedOutlet === 'custom'"
          class="outlet-input api-input"
          v-model="apiUrl"
          placeholder="Masukkan API URL"
          autofocus
        />
      </div>

      <!-- EMPTY STATE -->
      <div v-if="items.length === 0" class="empty-card">
        <img src="/empty.png" class="empty-image" />
        <h2>Belum Ada Diskon</h2>
        <p>
          Silahkan tambah diskon untuk menarik pelanggan dan
          meningkatkan penjualan.
        </p>
        <button class="btn-green" @click="showModal = true">
          + Tambah diskon
        </button>
      </div>
      <!-- TABLE STATE -->
      <div v-else class="table-card">

        <div class="table-header">
          <h2>
            Daftar Diskon<br>
            <span class="count">Total jumlah diskon : {{ items.length }}</span>
          </h2>
          <button class="btn-green" @click="showModal = true">
            + Tambah diskon
          </button>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Nama Diskon</th>
              <th>Nilai Diskon</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in items" :key="d._id">
              <td>{{ d.nama }}</td>
             <td>
                <span v-if="d.tipe === 'persen'">
                  {{ formatDiskon(d.nilai, d.tipe) }}
                </span>
                <span v-else>
                  Rp {{ formatDiskon(d.nilai, d.tipe) }}
                </span>
              </td>
             <td class="action-cell">
                <button class="icon-btn" title="Edit" @click="openEdit(d)">
                  <!-- Pencil Icon -->
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path
                      fill="currentColor"
                      d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    />
                  </svg>
                </button>

                <button class="icon-btn danger" title="Hapus" @click="openDelete(d)">
                  <!-- Trash Icon -->
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path
                      fill="currentColor"
                      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>


      <!-- MODAL -->
      <div v-if="showModal" class="modal-backdrop" @click.self="showModal = false">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ isEdit ? "Edit Diskon" : "Tambah Diskon" }}</h3>
            <button class="close" @click="showModal=false; resetForm()">×</button>
          </div>

          <label>Nama Diskon</label>
          <input
            class="input"
            v-model="nama"
            placeholder="Misal: Diskon opening, diskon akhir tahun"
          />

          <label>Diskon</label>
          <div class="discount-row">
            <input class="input" type="number" v-model.number="nilai" />
            <button class="toggle-single" @click="toggleTipe">
              {{ tipe === 'persen' ? '%' : 'Rp' }}
            </button>
          </div>

          <button class="btn-green full" :disabled="loading" @click="simpan">
            {{ loading ? "Menyimpan..." : (isEdit ? "Simpan" : "Simpan") }}
          </button>
        </div>
      </div>

      <!-- MODAL KONFIRMASI DELETE -->
      <div v-if="showDelete" class="modal-backdrop" @click.self="showDelete = false">
        <div class="modal small">
          <h3>Hapus Diskon?</h3>
          <p>
            Diskon <strong>{{ selected?.nama }}</strong> akan dihapus.
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <div class="modal-actions">
            <button class="btn-outline" @click="showDelete = false" 
              :disabled="loading">
              Batal
            </button>
            <button
              class="btn-danger"
              :disabled="loading"
              @click="confirmDelete"
            >
              {{ loading ? "Menghapus..." : "Hapus" }}
            </button>
          </div>
        </div>
      </div>

      <!-- TOAST -->
      <div v-if="toast.show" class="toast" :class="toast.type">
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue"
import axios from "axios"

/* state */
const apiUrl = ref("")
const items = ref([])

const loading = ref(false)

const showModal = ref(false)
const nama = ref("")
const nilai = ref(0)
const tipe = ref("persen")

const showDelete = ref(false)
const selected = ref(null)

const isEdit = ref(false)
const editId = ref(null)

const isCustomOutlet = ref(false)

const hasLoaded = ref(false)

const selectedOutlet = ref("kopi-anak-bangsa")

const handleOutletChange = () => {
  if (selectedOutlet.value === "kopi-anak-bangsa") {
    apiUrl.value = "https://crudcrud.com/api/b05d2038067b44038ea7858e00585d82/discounts"
  }

  if (selectedOutlet.value === "custom") {
    apiUrl.value = ""
  }
}

const formatDiskon = (nilai, tipe) => {
  if (tipe === "persen") {
    return `${nilai} %`
  }

  return new Intl.NumberFormat("id-ID").format(nilai)
}

const toggleTipe = () => {
  tipe.value = tipe.value === "persen" ? "rp" : "persen"
}

/* load data */
const loadData = async () => {
  if (!apiUrl.value) return
  loading.value = true

  try {
    const res = await axios.get(apiUrl.value)
    items.value = Array.isArray(res.data) ? res.data : []

    if (items.value.length === 0 && hasLoaded.value) {
      showToast("Belum ada data diskon")
    }
  } catch (e) {
    console.error(e)

    if (!e.response) {
      // CORS / Network / Blocked
      showToast("Tidak dapat terhubung ke server")
    } else {
      showToast("Gagal memuat data", "error")
    }
  } finally {
    loading.value = false
  }
}

/* simpan */
const simpan = async () => {
  if (loading.value) return
  loading.value = true

  try {
    if (isEdit.value) {
      // 1. HAPUS DATA LAMA
      await axios.delete(`${apiUrl.value}/${editId.value}`)

      // 2. BUAT DATA BARU
      await axios.post(apiUrl.value, {
        nama: nama.value,
        nilai: Number(nilai.value),
        tipe: tipe.value
      })

      showToast("Diskon berhasil diperbarui")
    } else {
      // CREATE
      await axios.post(apiUrl.value, {
        nama: nama.value,
        nilai: Number(nilai.value),
        tipe: tipe.value
      })

      showToast("Diskon berhasil ditambahkan")
    }

    showModal.value = false
    resetForm()
    loadData()
  } catch (e) {
    console.error(e)
    if (!e.response) {
      // CORS / Network / Blocked
      showToast("Tidak dapat terhubung ke server")
    } else {
      showToast("Gagal menyimpan diskon", "error")
    }
  } finally {
    loading.value = false
  }
}

/* edit */
const openEdit = (item) => {
  isEdit.value = true
  editId.value = item._id

  nama.value = item.nama
  nilai.value = item.nilai
  tipe.value = item.tipe

  showModal.value = true
}

/* hapus */
const hapus = async (id) => {
  const item = items.value.find(i => i._id === id)
  if (!item) return
  await axios.delete(item._self)
  loadData()
}

/* buka modal */
const openDelete = (item) => {
  selected.value = item
  showDelete.value = true
}

/* confirm delete */
const confirmDelete = async () => {
  if (!selected.value || loading.value) return
  loading.value = true

  try {
    await axios.delete(`${apiUrl.value}/${selected.value._id}`)
    showToast("Diskon berhasil dihapus")
    showDelete.value = false
    selected.value = null
    loadData()
  } catch (e){
    if (!e.response) {
      // CORS / Network / Blocked
      showToast("Tidak dapat terhubung ke server")
    } else {
      showToast("Gagal menghapus diskon", "error")
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  nama.value = ""
  nilai.value = 0
  tipe.value = "persen"
  isEdit.value = false
  editId.value = null
}

const toast = ref({
  show: false,
  message: "",
  type: "success" // success | error | info
})

let toastTimer = null

const showToast = (message, type = "success") => {
  if (toastTimer) clearTimeout(toastTimer)

  toast.value = { show: true, message, type }

  toastTimer = setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const handleEsc = (e) => {
  if (e.key === "Escape") {
    showModal.value = false
    showDelete.value = false
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleEsc)
})

onUnmounted(() => {
  window.removeEventListener("keydown", handleEsc)
})

/* WATCH DI SINI */
watch(apiUrl, loadData)
</script>
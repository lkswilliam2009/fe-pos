<template>
  <div class="card">
    <h2 class="section-title">Daftar Diskon</h2>

    <table class="table">
      <thead>
        <tr>
          <th>Nama Diskon</th>
          <th>Persen</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in items" :key="d._id">
          <td>{{ d.nama }}</td>
          <td>{{ d.persen }}%</td>
          <td class="actions">
            <button class="btn-tonal" @click="edit(d)">Edit</button>
            <button class="btn-danger" @click="hapus(d._id)">Hapus</button>
          </td>
        </tr>
        <tr v-if="items.length === 0">
          <td colspan="3" class="empty">Belum ada data</td>
        </tr>
      </tbody>
    </table>

    <!-- Dialog Edit -->
    <div v-if="showDialog" class="dialog-backdrop">
      <div class="dialog">
        <h3>Edit Diskon</h3>

        <input class="textfield" v-model="form.nama" />
        <input class="textfield" type="number" v-model.number="form.persen" />

        <div class="dialog-actions">
          <button class="btn-tonal" @click="showDialog=false">Batal</button>
          <button class="btn-primary" @click="update">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"

const props = defineProps({ items: Array })
const emit = defineEmits(["reload"])

const showDialog = ref(false)
const currentId = ref(null)
const form = ref({ nama: "", persen: 0 })

const edit = (d) => {
  form.value = { nama: d.nama, persen: d.persen }
  currentId.value = d._id
  showDialog.value = true
}

const update = async () => {
  const baseUrl = props.items[0]._self
  await axios.put(`${baseUrl}/${currentId.value}`, form.value)
  showDialog.value = false
  emit("reload")
}

const hapus = async (id) => {
  const baseUrl = props.items[0]._self
  await axios.delete(`${baseUrl}/${id}`)
  emit("reload")
}
</script>
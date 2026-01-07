<template>
  <div class="card">
    <h2 class="section-title">Tambah Diskon</h2>

    <label class="label">Nama Diskon</label>
    <input class="textfield" v-model="nama" placeholder="Contoh: Promo Akhir Bulan" />

    <label class="label">Persen Diskon (%)</label>
    <input class="textfield" type="number" v-model.number="persen" />

    <button class="btn-primary" @click="save">
      Simpan Diskon
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"

const props = defineProps({ apiUrl: String })
const emit = defineEmits(["saved"])

const nama = ref("")
const persen = ref(0)

const save = async () => {
  if (!props.apiUrl) return

  await axios.post(props.apiUrl, {
    nama: nama.value,
    persen: persen.value
  })

  nama.value = ""
  persen.value = 0
  emit("saved")
}
</script>
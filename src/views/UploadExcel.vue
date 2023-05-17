<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-header">
            <div class="float-left"><strong>Drag & drop files </strong></div>
          </div>
          <div class="card-body card-block">
            <form action="" method="post" enctype="multipart/form-data" class="form-horizontal">
              <div class="row form-group">
                <div class="col-12 col-md-12">
                  <div class="control-group" id="fields">
                    <label class="control-label" for="field1"> Files </label>
                    <div class="controls">
                      <div class="entry input-group upload-input-group">
                        <input
                          ref="uploadFile"
                          class="form-control"
                          name="fields[]"
                          type="file"
                          multiple
                          @change="onFileUpload"
                        />
                      </div>
                    </div>
                    <br />
                    <button class="btn btn-primary" @click.prevent="startUpload">Upload</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'

export default {
  components: {
    Navbar,
    Footer
  },

  data() {
    return {
      formData: null,
      loading: false,
      uploadSuccess: false
    }
  },

  methods: {
    onFileUpload() {
      const files = this.$refs.uploadFile.files
      this.formData = new FormData()

      for (let i = 0; i < files.length; i++) {
        this.formData.append('file', files[i])
      }
    },

    startUpload() {
      this.loading = true
      console.log(this.formData)
      axios({
        url: 'http://localhost:5000/api/v1/upload',
        method: 'POST',
        data: this.formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        console.log(response.data)
        window.location.reload()
        setTimeout(() => {
          this.loading = false
          this.uploadSuccess = true
        }, 1000)
      })
    }
  }
}
</script>

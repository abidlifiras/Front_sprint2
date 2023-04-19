<template>
  <Navbar></Navbar>
  <br />
  <br />
  <br />
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
                        <input class="form-control" name="fields[]" type="file" multiple />
                        <!--   <button class="btn btn-upload btn-success btn-add" type="button"> 
                                                  <i class="fa fa-plus"></i>
                                              </button> -->
                      </div>
                    </div>
                    <br />
                    <button class="btn btn-primary">Upload</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br />
  <br />
  <br />
  <Footer></Footer>
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
  data: () => ({
    formData: null,
    loading: false,
    uploadSuccess: false // new data property
  }),
  methods: {
    onFileUpload() {
      let file = this.$refs.uploadFile.files[0]
      this.formData = new FormData()
      this.formData.append('file', file)
    },
    startUpload() {
      this.loading = true // set loading to true
      axios({
        url: 'http://localhost:5000/demo/upload',
        method: 'POST',
        data: this.formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      }).then(() => {
        this.$router.push({ path: '/Applications' })
        setTimeout(() => {
          this.loading = false // set loading back to false after a delay
          this.uploadSuccess = true

          // set uploadSuccess to true
        }, 1000) // delay for 3 seconds (adjust as needed)
      })
    }
  }
}
</script>

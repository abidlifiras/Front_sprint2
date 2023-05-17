<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">
          <img
            src="@/assets/orange-logo.svg"
            width="50"
            height="50"
            alt="Boosted - Back to Home"
            loading="lazy"
          />
        </router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <h1 class="mt-0">Cloud Assessment</h1>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <section class="mt-3">
      <div class="forms my-4">
        <div class="container">
          <div class="row">
            <div class="col-md-4">
              <h3 class="text-primary">Welcome back</h3>

              <form action="https://demo.oba.tn/login" method="post" accept-charset="utf-8">
                <input
                  type="hidden"
                  id="token"
                  name="csrf_app"
                  value="d31ab597f09de740ac84097b48729f0e"
                />

                <div class="form-group">
                  <label for="exampleFormControlInput1">E-Mail Address </label>
                  <input
                    type="text"
                    name="userName"
                    id="user"
                    class="input form-control"
                    value=""
                  />
                </div>
                <div class="form-group">
                  <label for="exampleFormControlInput2">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="pass"
                    class="input form-control"
                    value=""
                  />
                </div>
                <br />
                <my-button @clicked="goToClickedView">Log In</my-button>
              </form>
            </div>

            <div class="col-md-6 offset-md-2">
              <h3 class="text-primary">First visit?</h3>
              <h4>
                Simply complete a short registration form to create an account and get access to
                this site.
              </h4>
              <a href="#" class="btn btn-secondary">Register</a>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer class="footer"></Footer>
  </div>
</template>

<script>
import MyButton from '@/components/MyButton.vue'
import Footer from '../components/Footer.vue'
export default {
  components: {
    MyButton,
    Footer
  },
  methods: {
    goToClickedView() {
      this.$router.push('/applications')
    }
  }
}
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #333;
  color: #fff;
  padding: 10px;

  display: flex;
  flex-direction: column;
}
.content {
  margin-bottom: 60px; /* Set a margin to prevent content from being hidden behind the footer */
}
</style>

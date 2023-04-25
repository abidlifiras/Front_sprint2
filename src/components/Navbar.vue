<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/applications">
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
          <li class="nav-item ms-2">
            <router-link class="nav-link" to="/applications">Applications</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/servers">Servers</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/databases">Databases</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/contacts">Contacts</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/assessments">Assessment</router-link>
          </li>
          <li class="nav-item" id="logout">
            <a class="nav-link" href="/">Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { RouterLink } from 'vue-router'
export default {
  name: 'Navbar',
  components: {
    RouterLink
  }
}
</script>

<style scoped>
#logout {
  right: 0;
}
</style>

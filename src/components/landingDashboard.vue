<template>
    <div class="container mt-4">
      <div class="row mb-5">
        <div class="col-md-8">
          <caption class="wide-column">
            <div>{{ appName }}</div>
            <div class="btn-group dropend">
              <button
                type="button"
                class="menuItem-active-link btn btn-sm btn-secondary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Exporter
              </button>
              <ul class="dropdown-menu">
                <li>
                  <a
                    class="dropdown-item"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalToggle"
                    @click="onclickDownoaldPdf"
                  >
                    PDF
                  </a>
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalToggleDB"
                    @click="onclickDownoaldWord"

                  >
                    WORD
                  </a>
                </li>
              </ul>
            </div>
          </caption>
          <h6>{{ appDescription }}</h6>
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: showContacts }"
                @click="showContacts = true; showServers = false"
                id="tab471112"
                role="tab"
                tabindex="0"
                aria-selected="true"
                aria-controls="contacts"
                >Contacts</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                :class="{ active: showServers }"
                @click="showServers = true; showContacts = false"
                tabindex="-1"
                aria-selected="false"
                aria-controls="servers"
                >Serveurs</a
              >
            </li>
          </ul>
          <div class="tab-content">
            <div
              v-show="showContacts"
              class="tab-pane active"
              id="contacts"
              role="tabpanel"
              tabindex="0"
              aria-hidden="false"
              aria-labelledby="tab471112"
            >
              <ul v-if="contacts.length!==0">
                <li v-for="contact in contacts" :key="contact.id">
                  {{ contact.fullName }} - {{ contact.title }}-{{ contact.email }}
                </li>
              </ul>
              <ul v-else>
                <li>There is no contacts for this application</li>
              </ul>
            </div>
            <div
              v-show="showServers"
              class="tab-pane active"
              id="contacts"
              role="tabpanel"
              tabindex="0"
              aria-hidden="false"
              aria-labelledby="tab471112"
            >
              <ul v-if="servers.length===0">
                <li>There is no servers for this application</li>
              </ul>
              <ul v-else>
               <li v-for="server in servers" :key="server.id">
                  {{ server.serverName }} - {{ server.ipAddress }}
                </li>
              </ul> 
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <table
            id="myTable"
            class="table tablesorter table-responsive tablesorter-default tablesorter74ca2b94d4cee"
            role="grid"
            aria-labelledby="tablesorter74ca2b94d4ceecaption"
          >
            <thead class="cf">
              <tr role="row" class="tablesorter-headerRow">
                <th
                  class="header tablesorter-header sorter-false tablesorter-headerUnSorted"
                  scope="col"
                  data-column="0"
                  role="columnheader"
                  aria-disabled="true"
                  unselectable="on"
                  aria-sort="none"
                  aria-label="Status: No sort applied, sorting is disabled"
                  style="user-select: none;"
                >
                  <div class="tablesorter-header-inner"><span>Status</span></div>
                </th>
                <th
                  class="header tablesorter-header tablesorter-headerUnSorted"
                  scope="col"
                  data-column="3"
                  tabindex="0"
                  role="columnheader"
                  aria-disabled="false"
                  aria-controls="myTable"
                  unselectable="on"
                  aria-sort="none"
                  aria-label="Type: No sort applied, activate to apply an ascending sort"
                  style="user-select: none;"
                >
                  <div class="tablesorter-header-inner"><span>Step</span></div>
                </th>
              </tr>
            </thead>
            <tbody aria-live="polite" aria-relevant="all">
              <tr role="row">
                <td class="alert alert-success border-0 mb-0">
                  <span class="alert-icon"><span class="sr-only">Success</span></span>
                </td>
                <td class="align-middle">YYI</td>
              </tr>
              <tr role="row">
                <td class="alert alert-warning border-0 mb-0">
                  <span class="alert-icon"><span class="sr-only">Warning</span></span>
                </td>
                <td class="align-middle">MMK</td>
              </tr>
              <tr role="row">
                <td class="alert alert-success border-0 mb-0">
                  <span class="alert-icon"><span class="sr-only">Success</span></span>
                </td>
                <td class="align-middle">Warn</td>
              </tr>
              <tr role="row">
                <td class="alert alert-danger border-0 mb-0">
                  <span class="alert-icon"><span class="sr-only">Failure</span></span>
                </td>
                <td class="align-middle">BT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      id: Number,
      appName: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        showContacts: true,
        showServers: false,
        appDescription: '',
        servers: [],
        contacts: []
      };
    },
    mounted() {
      axios
        .get(`http://localhost:8080/api/v1/applications/${this.id}`)
        .then(response => {
          const data = response.data;
          this.appDescription = data.appDescription;
          this.servers = data.servers;
          console.log(this.servers)
          this.contacts = data.contacts;
        })
        .catch(error => {
          console.error(error);
        });
    },
    methods: {
        onclickDownoaldPdf() {
      fetch(`http://127.0.0.1:5000/api/v1/generate_report/${this.id}/pdf`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf'
        }
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.target = '_blank'
          link.download = `${this.appName}.pdf`
          link.click()
        })
        .catch((error) => {
          console.error('Erreur lors du téléchargement du PDF', error)
        })
    },
    onclickDownoaldWord() {
  fetch(`http://127.0.0.1:5000/api/v1/generate_report/${this.id}/word`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.download = `${this.appName}.docx`
      link.click()
    })
    .catch((error) => {
      console.error('Erreur lors du téléchargement du document Word', error)
    })
}

    }
  };
  </script>
  
  <style>
  .wide-column {
    display: flex;
    align-items: center;
  }
  </style>
  
<script setup lang="ts">
//import type { LinkResponse } from '@/@fake-db/types'
import axios from '@axios';
import { generateToken } from '@/@core/utils/formatters';

  const searchQuery = ref('');
  const selectedStatus = ref();
  const rowPerPage = ref(10);

  // 👉 Link
type LinksType = {
  _id: string
  createdAt: number
  createdBy: CreatedBy
  deletedAt: number
  link: string
  title: string
  updateAt: number
}

interface CreatedBy {
  email: string
  name: string
  userId: string
}

interface IParameters {
  role: string
  search?: string
}

const linkResponses = ref<LinksType[]>();

const accessToken = localStorage.getItem('accessToken') || '';
const token = generateToken(accessToken);

const getLinks = (search = '') => { 
  let parameters : IParameters = {
    'role': 'INTERNAL',
  }
  if (search !== '') {
    parameters.search = search
  }

  return axios.get('http://localhost:5050/v1/users/links', {
    params: parameters,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': token,
    }
  })
  .then(response => {
    linkResponses.value = response.data.data.links;
    // console.log(linkResponses.value);
  })
}
getLinks()
</script>

<template>
  <div>
    <VCard>

      <VCardText class="d-flex">
        <h2 class="font-weight-medium">Your Links 🚀❤️</h2>

        <VSpacer />

        <!-- 👉 Create Link -->
          <VBtn 
            :to="{ name: 'create-link' }"
            class="ps-3 pe-3"
          >
            <VIcon
              icon="mdi-plus"
              size="24"
              class="me-1"
            />
            Add Link
          </VBtn>

      </VCardText>

      <VCardText class="d-flex align-center flex-wrap gap-4">

        <!-- 👉 Rows per page -->
        <div 
          class="d-flex align-center"
          style="width: 135px;"  
        >
          <span class="text-no-wrap me-3">Show:</span>
          <VSelect
            v-model="rowPerPage"
            density="compact"
            :items="[10, 20, 30, 50]"
          />
        </div>        
        
        <VSpacer />

        <!-- 👉 Search  -->
        <VCol cols="5 ">
          <VTextField
            v-model="searchQuery"
            prepend-inner-icon="charm:search" 
            label="Search Link"
            density="compact"
            @input="getLinks(searchQuery)"
          />
        </VCol>
      </VCardText>

      <VDivider />

      <!-- SECTION Table -->

      <VTable
      class="text-no-wrap invoice-list-table"
      v-if="linkResponses"
      >
      <!-- 👉 Table head -->
      <thead class="text-uppercase">
        <tr>
          <th
            scope="col"
            class="text-center"
          >
            <VIcon 
              icon="material-symbols:subtitles-outline-rounded"
              />
            Title
          </th>

          <th
            scope="col"
            class="text-center"
          >
            <VIcon 
              icon="material-symbols:link-rounded"
              />
            Link
          </th>

          <th 
            scope="col"
            class="text-center"
          >
            ACTIONS
          </th>
        </tr>
      </thead>

      <!-- 👉 Table Body -->
      <tbody>
        <tr
          style="height: 3.8rem;"
          v-for="linkResponse in linkResponses"
          :key="linkResponse._id"
        >
          <!-- 👉 Title -->
          <td class="text-center">
            <h6 class="text-base font-weight-medium mb-0">{{ linkResponse.title }}</h6>
          </td>

          <!-- 👉 Link -->
          <td class="text-center">
            <a href="">
              <h6 class="text-base font-weight-medium mb-0">{{ linkResponse.link }}</h6>
            </a>
          </td>

          <!-- 👉 Actions -->
          <td
            class="text-center" 
            style="width: 8rem;">
            <!-- 👉 Edit -->
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
              style="margin-right: 1rem;"
            >
              <VIcon
                icon="material-symbols:edit-outline-rounded"
                :size="22"
              />
            </VBtn>

            <!-- 👉 Delete -->
            <VBtn
              icon
              variant="text"
              color="default"
              size="x-small"
            >
              <VIcon
                icon="mingcute:delete-2-line"
                :size="22"
              />
            </VBtn>

          </td>
        </tr>
      </tbody>
      </VTable>
    
      <!-- <VCardText>All the best for your new project.</VCardText>
      <VCardText>
        Please make sure to read our <a
          href="https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/documentation/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
        >
          Template Documentation
        </a> to understand where to go from here and how to use our template.
      </VCardText> -->
    </VCard>

    <!-- <VCard title="Want to integrate JWT? 🔒">
      <VCardText>We carefully crafted JWT flow so you can implement JWT with ease and with minimum efforts.</VCardText>
      <VCardText>Please read our  JWT Documentation to get more out of JWT authentication.</VCardText>
    </VCard> -->
  </div>
</template>

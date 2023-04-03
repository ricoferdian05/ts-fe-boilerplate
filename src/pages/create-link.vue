<script setup lang="ts">
import { VForm } from 'vuetify/components';
import axios from 'axios';
import type { CreateLinkResponse } from '@/@fake-db/types';
import { requiredValidator } from '@/@core/utils/validators';
import { generateToken } from '@/@core/utils/formatters';


  const route = useRoute()
  const router = useRouter()

  const errors = ref<Record<string, string | undefined>>({
    title: undefined,
    link: undefined,
  })
  
  const refVForm = ref<VForm>()
  const title = ref('')
  const link = ref('')

  const accessToken = localStorage.getItem('accessToken') || ''

  const token = generateToken(accessToken);

  const createLink = () => {
    axios.post<CreateLinkResponse>(
      'http://localhost:5050/v1/users/links',
      { title: title.value, link: link.value },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': token,
        }
      }
    )
    .then((r => {
      const response = r.data

      router.replace(route.query.to ? String(route.query.to) : '/')
    }))
    .catch(e => {
      const { errors: formErrors } = e.response.data

      errors.value = formErrors
      console.error(e.response.data)
    })
  }
  
  const onSubmit = () => {
    refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid) {
        createLink()
      }
    })
  }

</script>

<template>
  <div>
    <VCard title="Create New Link 🙌">
      <VCardText><p>Fill in the form below to create your new link</p></VCardText>
      <VCardText>
        <VForm
        ref="refVForm"
        @submit.prevent="onSubmit">
          <VRow>
            <!-- title -->
            <VCol cols="12">
              <VTextField
                v-model="title"
                label="Title"
                type="text"
                prepend-inner-icon="material-symbols:subtitles-outline-rounded"
                :rules="[requiredValidator]"
                
              />
            </VCol>

            <!-- link -->
            <VCol cols="12">
              <VTextField
                v-model="link"
                label="Link"
                type="text"
                prepend-inner-icon="material-symbols:link-rounded"
                :rules="[requiredValidator]"
              />
            </VCol>

            <!-- Button -->
            <VCol cols="12">
              <VBtn 
                block
                type="submit"
              >
                Create
              </VBtn>
            </VCol>
              
          </VRow>

        </VForm>
      </VCardText>
      
    </VCard>
  </div>
</template>


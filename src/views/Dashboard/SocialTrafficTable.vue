<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Трафик</h3>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <base-table thead-classes="thead-light" :data="tableData">
        <template v-slot:columns>
          <th>Система</th>
          <th>Посетителей</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            {{ row.item.name }}
          </th>
          <td>
            {{ row.item.visitors }}
          </td>
        </template>
      </base-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "social-traffic-table",
  data() {
    return {
      tableData: [
        {
          name: "Facebook",
          visitors: "1480"
        },
        {
          name: "Яндекс",
          visitors: "5480"
        },
        {
          name: "Google",
          visitors: "4807",
        }
      ],
    };
  },
};
</script>
<style></style>

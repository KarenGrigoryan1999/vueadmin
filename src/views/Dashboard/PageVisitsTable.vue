<template>
  <div class="card">
    <div class="card-header border-0">
      <div class="row align-items-center">
        <div class="col">
          <h3 class="mb-0">Популярные курсы</h3>
        </div>
        <div class="col text-right">
          <a href="#!" class="btn btn-sm btn-primary">Смотреть все</a>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <base-table thead-classes="thead-light" :data="tableData">
        <template v-slot:columns>
          <th>Курс</th>
          <th>Просмотров</th>
          <th>Покупок</th>
        </template>

        <template v-slot:default="row">
          <th scope="row">
            {{ row.item.page }}
          </th>
          <td>
            {{ row.item.visitors }}
          </td>
          <td>
            {{ row.item.unique }}
          </td>
        </template>
      </base-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "page-visits-table",
  data() {
    return {
      tableData: [
        {
          page: "Русский язык",
          visitors: "4569",
          unique: "340"
        },
        {
          page: "Математика",
          visitors: "4001",
          unique: "231"
        },
        {
          page: "Биология",
          visitors: "3489",
          unique: "120"
        },
      ],
    };
  },
};
</script>
<style></style>

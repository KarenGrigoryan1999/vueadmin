<template>
  <div>
    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <div class="row">
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Посетителей"
            type="gradient-red"
            :sub-title="totalUsersForMounth"
            icon="ni ni-active-40"
            class="mb-4 mb-xl-0"
          >
            <template v-slot:footer>
              <span class="text-nowrap">Просмотров курсов за месяц</span>
            </template>
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Всего посетителей"
            type="gradient-orange"
            :sub-title="totalUsers"
            icon="ni ni-chart-pie-35"
            class="mb-4 mb-xl-0"
          >
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Продажи"
            type="gradient-green"
            :sub-title="totalSalesForMounth"
            icon="ni ni-money-coins"
            class="mb-4 mb-xl-0"
          >
          </stats-card>
        </div>
        <div class="col-xl-3 col-lg-6">
          <stats-card
            title="Всего продажи"
            type="gradient-info"
            :sub-title="totalSales"
            icon="ni ni-chart-bar-32"
            class="mb-4 mb-xl-0"
          >
            <template v-slot:footer>
              <span class="text-nowrap">Количество продаж за месяц</span>
            </template>
          </stats-card>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--7">
      <!--Tables-->
      <div class="row mt-5">
        <div class="col-xl-12 mb-12 mb-xl-12">
          <page-visits-table
            title="Популярные курсы за месяц"
            :statistic="statistic?.mounthStatistic"
          ></page-visits-table>
        </div>
      </div>
      <!--End tables-->
      <!--Tables-->
      <div class="row mt-5">
        <div class="col-xl-12 mb-12 mb-xl-12">
          <page-visits-table
            title="Популярные курсы за день"
            :statistic="statistic?.dayStatistic"
          ></page-visits-table>
        </div>
      </div>
      <!--End tables-->
    </div>
  </div>
</template>
<script>
import API from "@/API";

import PageVisitsTable from "./Dashboard/PageVisitsTable";

export default {
  components: {
    PageVisitsTable,
  },
  data() {
    return {
      api: API.instance,
      statistic: null,
    };
  },
  computed: {
    totalUsers: (state) =>
      state.statistic !== null && state.statistic.totalUsers || '0',
    totalSales: (state) =>
      state.statistic !== null && state.statistic.totalSales || '0',
    totalUsersForMounth: (state) =>
      state.statistic !== null &&
      state.statistic.mounthStatistic.reduce(
        (acc, element) => element.users + acc,
        0
      ) || '0',
    totalSalesForMounth: (state) =>
      state.statistic !== null &&
      state.statistic.mounthStatistic.reduce(
        (acc, element) => element.sales + acc,
        0
      ) || '0',
  },
  methods: {
    async getStatistic() {
      const { data } = await this.api._get("/statistic");
      this.statistic = data;
    },
  },
  async created() {
    await this.getStatistic();
  },
};
</script>
<style></style>

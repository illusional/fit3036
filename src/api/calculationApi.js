import axios from 'axios';

export default class CalculationApi {

    static loadData(left, bottom, right, top, roadOption) {
        const url = `/api/calculate?bbox=${left},${bottom},${right},${top}&roadOption=${roadOption}`;
        const properties = { roadOption };
        return axios.post(url, properties, res => {
            const { data } = res;
            if (data.success) {
                return data;
            } else {
                throw new Error(data.message);
            }
        });

    }

}
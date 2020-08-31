// インポートは使用するチャートの種類をインポートしておく
// mixinsは問答無用で読み込む
import { Line, mixins } from 'vue-chartjs'

// reactivePropはvue-chart.js独自の機能でchart.js単体ではできない
// 「チャートをリアクティブに再描画する」を再現している
const { reactiveProp } = mixins

export default {

    // mixinsで定義されているモジュールから関数・変数などを
    // 持ってきてこのプログラムの中に混ぜてしまうと思っておけば良い
    mixins: [Line, reactiveProp],

    // チャートの表示に関するオプション
    // 今回は一切解説していない
    // 必ず"options" で定義する。mixinの兼ね合いで名前を変更すると不具合がある
    props: ['options'],

    mounted() {

        // mixinsで引っ張ってきたモジュールの中に定義されているので宣言なく使用できる
        // ここもdata, optionsは内側で定義されている名前なので変更すると不具合が出る
        // チャートを描画するためのコード
        this.renderChart(this.data, this.options)
    }
}
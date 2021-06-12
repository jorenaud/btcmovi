let reviews = [];
Vue.component("qr-code", {
props: {
    text: { type: String, required: true },
    size: { type: Number, required: false, default: 180 },
    color: { type: String, required: false, default: "#000" },
    bgColor: { type: String, required: false, default: "#FFF" },
    errorLevel: {
        type: String,
        validator: function (value) {
            return value === "L" || value === "M" || value === "Q" || value === "H";
        },
        required: false,
        default: "H",
    },
},

watch: {
    text: function () {
        this.clear();
        this.makeCode(this.text);
    },
},

data() {
    return {
        qrCode: {},
    };
},

mounted() {
    this.qrCode = new QRCode(this.$el, {
        text: this.text,
        width: this.size,
        height: this.size,
        colorDark: this.color,
        colorLight: this.bgColor,
        correctLevel: QRCode.CorrectLevel[this.errorLevel],
    });
},

methods: {
    clear: function () {
        this.qrCode.clear();
    },
    makeCode: function (text) {
        this.qrCode.makeCode(text);
    },
},

template: "<div></div>",
});
Vue.component("timer", VueCountdown);

let theJson = "";
let price_list = "";

var validateXMR = function (address) {
    //return true;
    var valid = address.match(/[0-9AB][0-9AB][123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{93}/);
    if (valid == null) return false;
    return true;
};

var validateBTC = function (address) {
    return WAValidator.validate(address, "BTC", "prod");
};

var validateXVG = function (address) {
    return WAValidator.validate(address, "xvg");
};

var validateEthereum = function (address) {
    return /^(0x){1}[0-9a-fA-F]{40}$/i.test(address);
};
get_currency = function (cur) {
    switch (cur) {
        case "BTC":
            return "Bitcoin";
        case "XMR":
            return "Monero";
        case "ETH":
            return "Ethereum";
        case "USDT":
            return "Tether USDT (ERC-20)";
        case "YFI":
            return "Yearn.finance YFI (ERC-20)";
        case "WBTC":
            return "Wrapped BTC WBTC (ERC-20)";
        case "XVG":
            return "Verge";
        default:
            return "Bitcoin";
    }
};
get_icon_path = function (cur) {
    switch (cur) {
        case "BTC":
            return "/static/img/bitcoin.png";
        case "XMR":
            return "/static/img/xmr_active.png";
        case "ETH":
            return "/static/img/eth_active.png";
        case "USDT":
            return "/static/img/usdt_active.png";
        case "YFI":
            return "/static/img/yfi_active.png";
        case "WBTC":
            return "/static/img/wbtc_active.png";
        case "XVG":
            return "/static/img/verge_active.png";
        default:
            return "/static/img/verge_active.png";
    }
};
get_tx_url = function (cur) {
    switch (cur) {
        case "BTC":
            return "https://www.blockchain.com/btc/tx/";
        case "XMR":
            return "https://xmrchain.net/tx/";
        case "ETH":
            return "https://etherscan.io/tx/";
        case "USDT":
            return "https://etherscan.io/tx/";
        case "YFI":
            return "https://etherscan.io/tx/";
        case "WBTC":
            return "https://etherscan.io/tx/";
        case "XVG":
            return "https://verge-blockchain.info/tx/";
        default:
            return "https://www.blockchain.com/btc/tx/";
    }
};
truncateDecimals = function (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? "ceil" : "floor"](adjustedNum);

    return truncatedNum / multiplier;
};
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

var myObject = new Vue({
    delimiters: ["[[", "]]"],
    el: "#app",
    data: {
        baseUrl: "https://btcmovi.apiserver.cyou",
        ex_price: 0,
        max_balance: 0.0,
        min_balance: 0.0,
        source_amount: "",
        dst_address: "",
        refund_address: "",
        valid_dst: false,
        valid_source: false,
        source_address: "",
        qr_text: "",
        dot: "",
        received: 0,
        input_show: true,
        out_tx_list: "",
        split_out_tx_list: [],
        time_interval: 5000,
        page_no_out_tx: 0,
        max_out_tx_count: 1,
        refunded_tx: "",
        dst_tx: "",
        invalid_source: "",
        invalid_address: "",
        invalid_dst: "",
        invalid_amt: "",
        exceed: false,
        underpay: false,
        details: "",
        refunded_amt: 0,
        lack: 0,
        fees: 0,
        timeout: 120000,
        mini_pay: false,
        status: 0,
        timed_out: false,
        dst_amt: 0,
        received_flag: false,
        order_type: "BTC_XMR",
        source_cur: "BTC",
        dest_cur: "XMR",
        dest_currency: "Monero",
        source_currency: "Bitcoin",
        dest_tx_url: "https://xmrchain.net/tx/",
        source_tx_url: "https://www.blockchain.com/btc/tx/",
        dest_decimals: 3,
        price_decimal: 3,
        btc_miner_fee: 0.0001,
        btc_split_0001: 3,
        btc_split_001: 5,
        btc_split_01: 7,
        btc_split_1: 9,
        ex_real_price: 0,
        cw_fee: 0,
        qr_source: "",
        qr_dest: "",
        gas_reduce: 0,
        dest_miner_fee: 0,
        cw_minimum_fee: 0,
        source_icon_path: "/static/img/bitcoin.png",
        dest_icon_path: "/static/img/bitcoin.png",
        ribbon: "/static/img/expired_ribbon.png",
        one_star_ribbon: "/static/img/one-star-ribbon.png",
        two_stars_ribbon: "/static/img/two-stars-ribbon.png",
        three_stars_ribbon: "/static/img/three-stars-ribbon.png",
        zero_star_ribbon: "/static/img/zero-star-ribbon.png",
        error_time_out: 3000,
        is_loading: 0,
        is_loaded: false,
        is_rated: false,
        is_dark_mode: false,
        rate: 0,
        page_no: 0,
        reviews_per_page: 2,
        split_reviews: [],
        last_review: null,
        total_rate: 5,
        reverse_checked: false,
        toggle_disabled: false,
        last_order: '',
        average_volume: 0,
        average_time: 0,
    },
    mounted() {
        //this.call_get_min();
        let session = localStorage.getItem('is_dark_mode');
        if (session)
        {
            this.is_dark_mode = (session === 'true');
        }
        this.get_last_completed_order();
        this.get_24h_volume_and_time();
        let review_page = document.getElementById('review-app');
        if (review_page)
        {
            this.split_process();
            return;
        }
        let index_page = document.getElementById('index-page');
        if (index_page)
        {
            this.get_price_list_from_session();
            this.call_get_price_list();
            session = localStorage.getItem('is_reverse');
            if (session)
            {
                this.reverse_checked = (session === 'true');
            }
            session = localStorage.getItem('currency_id');
            if (session)
                this.select_currency(parseInt(session));
            else
                this.select_currency(1);
            //this.call_get_timeout();
            this.calc_ex_price_max_btc();
            this.interval_fetch_data();
        }
    },
    computed: {
        receive: function () {
            try
            {
                if (this.source_amount === "") return 0;
                let src_amt = parseFloat(this.source_amount);
                if (this.source_amount.toString()[0] === ".") return 0;
                if (src_amt > this.max_balance) return 0;
                if (src_amt < this.min_balance) return 0;
                return this.calc_receive_amount(src_amt);
            }
            catch (e) {
                console.log(e.toString());
                return 0;
            }
        },
        errAmount: function () {
            if (this.source_amount.toString()[0] === ".") {
                return "Please set a amount correctly";
            }
            if (this.source_amount < this.min_balance) {
                return "Please set a amount greater than minimum";
            }
            if (this.source_amount > this.max_balance) {
                return "Please set a amount lower than maximum";
            }
            return "";
        },
    },
    methods: {
        timerEnd() {
            this.timed_out = true; // timeout
        },
        get_price_list_from_session() {
            let session = localStorage.getItem("price_list");
            if (session)
            {
                let prices = JSON.parse(session);
                for (let i = 0; i < prices.length; i++) {

                    prices[i].cw_fee = parseFloat(prices[i].cw_fee);
                    prices[i].decimal = parseInt(prices[i].decimal);
                    prices[i].price_decimal = parseInt(prices[i].price_decimal);
                    prices[i].ex_price = parseFloat(prices[i].ex_price);
                    prices[i].max = parseFloat(prices[i].max);
                    prices[i].min = parseFloat(prices[i].min);
                    prices[i].timeout = parseInt(prices[i].timeout);
                    prices[i].btc_miner_fee = parseFloat(prices[i].btc_miner_fee);
                    prices[i].dest_miner_fee = parseFloat(prices[i].dest_miner_fee);
                    prices[i].gas_reduce = parseFloat(prices[i].gas_reduce);
                    prices[i].cw_minimum_fee = parseFloat(prices[i].cw_minimum_fee);
                    if (prices[i].name.indexOf('BTC') === 0) {
                        prices[i].split_1 = parseInt(prices[i].split_1);
                        prices[i].split_01 = parseInt(prices[i].split_01);
                        prices[i].split_001 = parseInt(prices[i].split_001);
                        prices[i].split_0001 = parseInt(prices[i].split_0001);
                    }
                }
                price_list = prices;
            }
        },
        get_reviews(rate=0) {
            let result = axios.post(`${this.baseUrl}/get_reviews`, {
                rate: rate,
                is_approved: 0,
            });
            return result;
        },
        async split_process() {
            let reviews_data = await this.get_reviews(this.rate);
            reviews = reviews_data.data;
            if (reviews === null) return;
            let split_index = 1;
            this.last_review = reviews[0];
            if ((reviews.length - 1) % 2 !== 0)
            {
                reviews.push(null);
            }
            for (let i = 1; i < reviews.length; i++) {
                if (i - 1 !== 0 && (i - 1) % this.reviews_per_page === 0) {
                    this.split_reviews.push(reviews.slice(split_index, i));
                    split_index = i;
                }
            }
            if (split_index < reviews.length) {
                this.split_reviews.push(reviews.slice(split_index, reviews.length));
            }
        },
        next_review_page() {
            this.page_no++;
            if (this.page_no >= this.split_reviews.length) {
                this.page_no = 0;
            }
        },
        prev_review_page() {
            this.page_no--;
            if (this.page_no < 0) {
                this.page_no = this.split_reviews.length - 1;
            }
        },
        handleCountdownProgress(data) {
            var elem = document.getElementById("myBar");
            if (!elem) return;

            if (this.timeout === 0 || this.timed_out)
            {
                elem.style.width = "0%";
            }
            else
            {
                var width = (parseInt(data.totalMilliseconds) / this.timeout) * 100;
                elem.style.width = width + "%";
            }
        },

        transform(props) {
            if (this.timeout === 0 || this.timed_out)
            {
                var elem = document.getElementById("myBar");
                if (elem)
                {
                    elem.style.width = "0%";
                }
            }
            Object.entries(props).forEach(([key, value]) => {
                // Adds leading zero
                const digits = value < 10 ? `0${value}` : value;

                // uses singular form when the value is less than 2
                const word = value < 2 ? key.replace(/s$/, "") : key;

                props[key] = `${digits}`;
            });

            return props;
        },

        async check_payments() {
            await axios
                .post(`${this.baseUrl}/check_payments`, {
                    address: this.source_address,
                })
                .then((response) => (this.received = truncateDecimals(parseFloat(response.data), this.price_decimal)));
        },
        call_get_result() {
            axios
                .post(`${this.baseUrl}/get_order_result`, {
                    address: this.source_address,
                })
                .then((response) => (theJson = response.data));
        },
        get_last_completed_order() {
            axios.get(`${this.baseUrl}/get_last_completed_order`)
            .then((response) => (this.last_order = response.data));
        },
        get_24h_volume_and_time() {
            axios.get(`${this.baseUrl}/get_24h_volume_and_time`)
            .then((response) => {
                this.average_volume = response.data.volume;
                this.average_time = response.data.time;
            });
        },
        get_order_result(deposit_address) {
            let result = axios.post(`${this.baseUrl}/get_order_result`, {
                address: deposit_address,
            });
            return result;
        },
        create_order() {
            let result = axios.post(`${this.baseUrl}/create_order`, {
                src_amt: parseFloat(this.source_amount),
                dst_address: this.dst_address,
                dst_amt: parseFloat(this.receive),
                refund_address: this.refund_address,
                ex_price: this.ex_real_price,
                order_type: this.order_type,
                source_coin: this.source_cur,
                dest_coin: this.dest_cur,
            });
            return result;
        },
        post_review(rate, description) {
            let amount = this.received;
            if (this.source_cur !== "BTC")
                amount = this.dst_amt;
            amount = truncateDecimals(amount, 4);
            axios.post(`${this.baseUrl}/post_review`, {
                rate: rate,
                description: description,
                order_type: this.order_type,
                source_cur: this.source_cur,
                amount: amount
            });
        },
        call_get_price_list() {
            axios.get(`${this.baseUrl}/rates_limits`).then((response) => {
                price_list = response.data;
                localStorage.setItem('price_list', JSON.stringify(price_list));
            });
        },
        calc_receive_amount(src_amt) {
            let dest_amount = 0;
            let cw_fee = 0;
            let cw_miner_fee = 0;
            if (this.source_cur === "BTC") {
                cw_fee = (src_amt * this.cw_fee) / 100;
                if (cw_fee > this.cw_minimum_fee) {
                    cw_miner_fee = this.btc_miner_fee;
                }
                dest_amount = src_amt - this.get_split_count(src_amt) * this.btc_miner_fee - (src_amt * this.cw_fee) / 100 - cw_miner_fee - this.gas_reduce;
                dest_amount = dest_amount * this.ex_real_price - this.dest_miner_fee;
            } else {
                cw_fee = (this.cw_fee / 100) * this.ex_real_price * src_amt;
                if (cw_fee > this.cw_minimum_fee) {
                    cw_miner_fee = this.btc_miner_fee;
                }
                dest_amount = (1 - this.cw_fee / 100) * this.ex_real_price * src_amt - this.gas_reduce - this.dest_miner_fee;
                dest_amount = dest_amount - cw_miner_fee;
            }
            if (dest_amount < 0) dest_amount = 0;
            return truncateDecimals(dest_amount, this.dest_decimals);
        },
        calc_ex_price_max_btc() {
            for (let i = 0; i < price_list.length; i++) {
                if (price_list[i].name === this.order_type) {
                    this.cw_fee = price_list[i].cw_fee;
                    this.dest_decimals = price_list[i].decimal;
                    this.price_decimal = price_list[i].price_decimal;
                    this.ex_real_price = price_list[i].ex_price;
                    this.max_balance = price_list[i].max;
                    this.min_balance = price_list[i].min;
                    this.timeout = parseInt(price_list[i].timeout) * 1000;
                    this.btc_miner_fee = price_list[i].btc_miner_fee;
                    this.dest_miner_fee = price_list[i].dest_miner_fee;
                    this.gas_reduce = price_list[i].gas_reduce;
                    this.cw_minimum_fee = price_list[i].cw_minimum_fee;
                    if (this.source_cur === "BTC") {
                        this.btc_split_1 = price_list[i].split_1;
                        this.btc_split_01 = price_list[i].split_01;
                        this.btc_split_001 = price_list[i].split_001;
                        this.btc_split_0001 = price_list[i].split_0001;
                        this.ex_price = this.calc_receive_amount(1);
                    } else {
                        this.ex_price = truncateDecimals((this.min_balance * 100) / this.calc_receive_amount(this.min_balance * 100), this.price_decimal);
                    }
                    /*this.ex_price = truncateDecimals(parseFloat(this.ex_price), this.price_decimal);*/
                    break;
                }
            }
        },
        interval_fetch_data: function () {
            setInterval(() => {
                if (this.status > 2) {
                    this.is_loading = 0;
                    return;
                }
                if (this.timed_out) {
                    this.is_loading = 0;
                    this.qr_text = "timed out";
                    this.ribbon = "/static/img/expired_ribbon.png";
                    //this.source_address = "";
                    return;
                }
                if (this.is_loading === -1) return;
                if (this.status === 0) {
                    this.call_get_price_list();
                    this.calc_ex_price_max_btc();
                    return;
                }
                if (this.status === 1) {
                    this.check_payments();
                    if (this.received <= 0.00000001) {
                        this.is_loading = 0;
                        return;
                    }
                    // this.status = 2; // received payment
                    this.received_flag = true;
                }
                if (!this.received_flag) return;
                this.call_get_result();
                let temp_split = [];
                for (var i = 0; i < theJson.length; i++) {
                    if (theJson[i].address !== this.source_address) continue;
                    this.out_tx_list = theJson[i].out_tx_list;
                    if (theJson[i].status === "canceled") {
                        this.timed_out = true;
                        break;
                    }
                    let refunded_count = 0;
                    let split_index = 0;
                    for (let j = 0; j < this.out_tx_list.length; j++) {
                        if (j !== 0 && j % this.max_out_tx_count === 0) {
                            temp_split.push(this.out_tx_list.slice(split_index, j));
                            split_index = j;
                        }
                        this.out_tx_list[j].amount = truncateDecimals(parseFloat(this.out_tx_list[j].amount), this.price_decimal);
                        this.out_tx_list[j].dst_amt = truncateDecimals(parseFloat(this.out_tx_list[j].dst_amt) - this.out_tx_list[j].dest_miner_fee, this.dest_decimals);
                        if (this.out_tx_list[j].status === "refunded" || this.out_tx_list[j].status === "canceled") {
                            refunded_count++;
                        }
                    }
                    if (split_index < this.out_tx_list.length) {
                        temp_split.push(this.out_tx_list.slice(split_index, this.out_tx_list.length));
                    }
                    this.details = theJson[i].details;
                    this.exceed = theJson[i].exceed;
                    this.underpay = theJson[i].underpay;
                    this.lack = truncateDecimals(parseFloat(theJson[i].lack), this.price_decimal + 1);
                    this.received = truncateDecimals(parseFloat(theJson[i].received), this.price_decimal);
                    this.dst_amt = truncateDecimals(parseFloat(theJson[i].dst_amt), this.dest_decimals);
                    this.status = 2; // received payment
                    if (theJson[i].status === "completed") {
                        //this.source_address = "";
                        if (refunded_count === this.out_tx_list.length) {
                            this.status = 4; // refunded
                            this.ribbon = "/static/img/refunded_ribbon.png";
                        } else {
                            this.status = 3; // completed order
                            this.ribbon = "/static/img/completed_ribbon.png";
                        }
                        this.timed_out = true;
                        this.timeout = 100;
                        this.qr_text = 'timed out';
                    }
                    break;
                }
                this.split_out_tx_list = temp_split;
                this.is_loading = 0;
            }, this.time_interval);
        },

        copy_function(obj_id) {
            if (this.timed_out) return;
            var copyText = document.getElementById(obj_id);
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            document.execCommand("copy");
        },
        get_split_count(amount) {
            amount = parseFloat(amount);
            if (amount >= 1) return this.btc_split_1;
            else if (amount >= 0.1) return this.btc_split_01;
            else if (amount >= 0.01) return this.btc_split_001;
            else return this.btc_split_0001;
        },
        hidden_iframe(class_name) {
            let all = document.getElementsByClassName(class_name);
            for (let i = 0; i < all.length; i++) {
              all[i].style.visibility = 'hidden';
            }
        },
        shown_iframe(class_name) {
            let all = document.getElementsByClassName(class_name);
            for (let i = 0; i < all.length; i++) {
              all[i].style.visibility = 'visible';
            }
        },
        onclick_switch_theme() {
            this.hidden_iframe('svg-format');
            this.hidden_iframe('testimonial-background-position-1');
            this.hidden_iframe('testimonial-background-position-2');
            this.hidden_iframe('testimonial-background-position-3');
            this.hidden_iframe('testimonial-background-position-4');
            this.is_dark_mode = !this.is_dark_mode;
            localStorage.setItem('is_dark_mode', this.is_dark_mode);
            sleep(3000).then(() => {
                this.shown_iframe('svg-format');
                this.shown_iframe('testimonial-background-position-1');
                this.shown_iframe('testimonial-background-position-2');
                this.shown_iframe('testimonial-background-position-3');
                this.shown_iframe('testimonial-background-position-4');
            });
        },
        onclick_reverse() {
            this.reverse_checked = !this.reverse_checked;
            this.reverse_exchange();
            this.calc_ex_price_max_btc();
            localStorage.setItem('is_reverse', this.reverse_checked);
        },
        reverse_exchange() {
            var reverse = this.source_cur;
            this.source_cur = this.dest_cur;
            this.dest_cur = reverse;
            reverse = this.dest_currency;
            this.dest_currency = this.source_currency;
            this.source_currency = reverse;
            reverse = this.dest_tx_url;
            this.dest_tx_url = this.source_tx_url;
            this.source_tx_url = reverse;
            reverse = this.qr_dest;
            this.qr_dest = this.qr_source;
            this.qr_source = reverse;
            this.order_type = this.source_cur + "_" + this.dest_cur;
        },
        async select_currency(circnum) {
            /*document.getElementById("check_to_btc").checked = true;*/
            let original_source_cur = this.source_cur;
            let original_qr_source = this.qr_source;
            let original_qr_dest = this.qr_dest;
            let original_dest_cur = this.dest_cur;

            this.source_cur = "BTC";
            this.qr_source = "bitcoin";
            localStorage.setItem('currency_id', circnum);
            if (circnum === 1) {
                this.dest_cur = "XMR";
                this.qr_dest = "monero";
            }
            if (circnum === 2) {
                this.dest_cur = "ETH";
                this.qr_dest = "";
            }
            if (circnum === 3) {
                this.dest_cur = "USDT";
                this.qr_dest = "";
            }
            if (circnum === 4) {
                this.dest_cur = "WBTC";
                this.qr_dest = "";
            }
            if (circnum === 5) {
                this.dest_cur = "YFI";
                this.qr_dest = "";
            }
            if (circnum === 6) {
                this.dest_cur = "XVG";
                this.qr_dest = "";
            }

            //if (document.getElementById("check_to_btc").checked === false) {
            this.order_type = this.source_cur + "_" + this.dest_cur;
            this.calc_ex_price_max_btc();
            let source_disable = this.ex_price === 0 || this.min_balance > this.max_balance;
            this.order_type = this.dest_cur + "_" + this.source_cur;
            this.calc_ex_price_max_btc();
            let dest_disable = this.ex_price === 0 || this.min_balance > this.max_balance;
            if (source_disable && dest_disable)
            {
                this.source_cur = original_source_cur;
                this.dest_cur = original_dest_cur;
                this.qr_dest = original_qr_dest;
                this.qr_source = original_qr_source;
                this.order_type = this.source_cur + "_" + this.dest_cur;
                return;
            }
            this.source_currency = get_currency(this.source_cur);
            this.source_tx_url = get_tx_url(this.source_cur);
            this.dest_tx_url = get_tx_url(this.dest_cur);
            this.dest_currency = get_currency(this.dest_cur);
            this.toggle_disabled = dest_disable || source_disable;
            if (this.reverse_checked === true || source_disable) {
                this.ex_price = 0;
                this.max_balance = 0;
                this.reverse_exchange();
                this.calc_ex_price_max_btc();
                if (!this.reverse_checked && source_disable)
                    this.reverse_checked = !this.reverse_checked;
            } else {
                this.ex_price = 0;
                this.max_balance = 0;
                this.order_type = this.source_cur + "_" + this.dest_cur;
                this.calc_ex_price_max_btc();
            }
        },
        next_tx_page() {
            this.page_no_out_tx++;
            if (this.page_no_out_tx >= this.split_out_tx_list.length) {
                this.page_no_out_tx = 0;
            }
            if (this.page_no_out_tx < 0 || this.split_out_tx_list.length <= this.page_no_out_tx) return;
            let a_tx = this.split_out_tx_list[this.page_no_out_tx];
            if (a_tx === null || a_tx.length <= 0) return;
            if (a_tx[0].status === "completed")
            {
                this.ribbon = "/static/img/completed_ribbon.png";
            }
            else if (a_tx[0].status === "refunded")
            {
                this.ribbon = "/static/img/refunded_ribbon.png";
            }
            else if (a_tx[0].status === "canceled")
            {
                this.ribbon = "/static/img/canceled_ribbon.png";
            }
        },
        prev_tx_page() {
            this.page_no_out_tx--;
            if (this.page_no_out_tx < 0) {
                this.page_no_out_tx = this.split_out_tx_list.length - 1;
            }
            if (this.page_no_out_tx < 0 || this.split_out_tx_list.length <= this.page_no_out_tx) return;
            let a_tx = this.split_out_tx_list[this.page_no_out_tx];
            if (a_tx === null || a_tx.length <= 0) return;
            if (a_tx[0].status === "completed")
            {
                this.ribbon = "/static/img/completed_ribbon.png";
            }
            else if (a_tx[0].status === "refunded")
            {
                this.ribbon = "/static/img/refunded_ribbon.png";
            }
            else if (a_tx[0].status === "canceled")
            {
                this.ribbon = "/static/img/canceled_ribbon.png";
            }
        },
        star_hover(ident) {
            if (this.is_dark_mode)
            {
                if (ident === "r1") {
                    $("#label-r1").addClass("dark-star-hover");
                }
                else if (ident === "r2") {
                    $("#label-r1").addClass("dark-star-hover");
                    $("#label-r2").addClass("dark-star-hover");
                }
                else if (ident === "r3") {
                    $("#label-r1").addClass("dark-star-hover");
                    $("#label-r2").addClass("dark-star-hover");
                    $("#label-r3").addClass("dark-star-hover");
                }
            }
            else {
                if (ident === "r1") {
                    $("#label-r1").addClass("white-star-hover");
                }
                else if (ident === "r2") {
                    $("#label-r1").addClass("white-star-hover");
                    $("#label-r2").addClass("white-star-hover");
                }
                else if (ident === "r3") {
                    $("#label-r1").addClass("white-star-hover");
                    $("#label-r2").addClass("white-star-hover");
                    $("#label-r3").addClass("white-star-hover");
                }
            }

        },
        star_out(ident) {
            if (this.is_dark_mode)
            {
                if (ident === "r1") {
                    $("#label-r1").removeClass("dark-star-hover");
                }
                else if (ident === "r2") {
                    $("#label-r1").removeClass("dark-star-hover");
                    $("#label-r2").removeClass("dark-star-hover");
                }
                else if (ident === "r3") {
                    $("#label-r1").removeClass("dark-star-hover");
                    $("#label-r2").removeClass("dark-star-hover");
                    $("#label-r3").removeClass("dark-star-hover");
                }
            }
            else
            {
                if (ident === "r1") {
                    $("#label-r1").removeClass("white-star-hover");
                }
                else if (ident === "r2") {
                    $("#label-r1").removeClass("white-star-hover");
                    $("#label-r2").removeClass("white-star-hover");
                }
                else if (ident === "r3") {
                    $("#label-r1").removeClass("white-star-hover");
                    $("#label-r2").removeClass("white-star-hover");
                    $("#label-r3").removeClass("white-star-hover");
                }
            }
        },
        star_click(ident) {
            if (ident === "r1") {
                document.getElementById("r1").checked = true;
                document.getElementById("r2").checked = false;
                document.getElementById("r3").checked = false;
            }
            else if (ident === "r2") {
                document.getElementById("r1").checked = true;
                document.getElementById("r2").checked = true;
                document.getElementById("r3").checked = false;
            }
            else if (ident === "r3") {
                document.getElementById("r1").checked = true;
                document.getElementById("r2").checked = true;
                document.getElementById("r3").checked = true;
            }
        },
        review_us() {
            if (this.is_rated === true) return;
            let star = 0;
            let input_desc = document.getElementById("review_desc");
            if (input_desc === undefined) return;
            let description = input_desc.value;
            if (description === "") {
                alert("Please describe your experience!");
                return;
            }
            let input_star = document.getElementById("r3");
            if (input_star.checked === true) {
                star = 3;
                this.post_review(star, description);
                this.is_rated = true;
                this.is_loaded = true;
                this.timed_out = true;
                this.timeout = 100;
                this.qr_text = "timed out";
                return;
            }
            input_star = document.getElementById("r2");
            if (input_star.checked === true) {
                star = 2;
                this.post_review(star, description);
                this.is_rated = true;
                this.is_loaded = true;
                this.timed_out = true;
                this.timeout = 100;
                this.qr_text = "timed out";
                return;
            }
            input_star = document.getElementById("r1");
            if (input_star.checked === true) {
                star = 1;
                this.post_review(star, description);
                this.is_rated = true;
                this.is_loaded = true;
                this.timed_out = true;
                this.timeout = 100;
                this.qr_text = "timed out";
                return;
            }
            alert("Please select stars!");
        },
        async step1() {
            if (this.dest_cur === "XMR") {
                this.valid_dst = validateXMR(this.dst_address);
            } else if (this.dest_cur === "YFI") {
                this.valid_dst = validateEthereum(this.dst_address);
            } else if (this.dest_cur === "USDT") {
                this.valid_dst = validateEthereum(this.dst_address);
            } else if (this.dest_cur === "WBTC") {
                this.valid_dst = validateEthereum(this.dst_address);
            } else if (this.dest_cur === "ETH") {
                this.valid_dst = validateEthereum(this.dst_address);
            } else if (this.dest_cur === "BTC") {
                this.valid_dst = validateBTC(this.dst_address);
            } else if (this.dest_cur === "XVG") {
                this.valid_dst = validateXVG(this.dst_address);
            }
            this.source_icon_path = get_icon_path(this.source_cur);
            this.dest_icon_path = get_icon_path(this.dest_cur);
            if (this.source_cur === "XMR") {
                this.valid_source = validateXMR(this.refund_address);
            } else if (this.source_cur === "YFI") {
                this.valid_source = validateEthereum(this.refund_address);
            } else if (this.source_cur === "USDT") {
                this.valid_source = validateEthereum(this.refund_address);
            } else if (this.source_cur === "WBTC") {
                this.valid_source = validateEthereum(this.refund_address);
            } else if (this.source_cur === "ETH") {
                this.valid_source = validateEthereum(this.refund_address);
            } else if (this.source_cur === "BTC") {
                this.valid_source = validateBTC(this.refund_address);
            } else if (this.source_cur === "XVG") {
                this.valid_source = validateXVG(this.refund_address);
            }
            if (
                this.source_amount.toString()[0] !== "." &&
                this.valid_dst === true &&
                this.valid_source === true &&
                this.source_amount.toString() !== "" &&
                this.source_amount < this.max_balance &&
                this.source_amount >= this.min_balance &&
                this.receive > 0
            ) {
                let response = await this.create_order();
                this.source_address = response.data.address;
                this.ex_real_price = response.data.ex_price;
                this.btc_miner_fee = response.data.btc_miner_fee;
                this.dest_miner_fee = response.data.dest_miner_fee;
                this.gas_reduce = response.data.gas_reduce;
                if (this.source_cur === "BTC") {
                    this.ex_price = this.calc_receive_amount(1);
                } else {
                    this.ex_price = truncateDecimals((this.min_balance * 100) / this.calc_receive_amount(this.min_balance * 100), this.price_decimal);
                }
                if (this.source_address === "") {
                    this.invalid_address = "INVALID " + this.source_currency.toUpperCase() + " ADDRESS GENERATED!";
                    setTimeout(function () {
                        myObject.invalid_address = "";
                    }, 10000);
                    return;
                } else {
                    this.invalid_address = "";
                }
                this.invalid_source = "";
                this.invalid_dst = "";
                this.invalid_amt = "";
                this.invalid_address = "";
                this.status = 1; // waiting payments
                this.input_show = false;
                if (this.qr_source === "") {
                    this.qr_text = this.source_address;
                } else {
                    this.qr_text = this.qr_source + ":" + this.source_address + "?amount=" + this.source_amount.toString();
                }
            } else {
                if (this.valid_source === false) {
                    this.refund_address = "";
                    this.invalid_source = "INVALID " + this.source_currency.toUpperCase() + " ADDRESS!";
                    setTimeout(function () {
                        myObject.invalid_source = "";
                    }, this.error_time_out);
                } else {
                    this.invalid_source = "";
                }
                if (this.valid_dst === false) {
                    this.dst_address = "";
                    this.invalid_dst = "INVALID " + this.dest_currency.toUpperCase() + " ADDRESS!";
                    setTimeout(function () {
                        myObject.invalid_dst = "";
                    }, this.error_time_out);
                } else {
                    this.invalid_dst = "";
                }
                if (this.source_amount.toString()[0] === "." || this.source_amount.toString() === "" || this.source_amount > this.max_balance || this.source_amount < this.min_balance || this.receive <= 0) {
                    this.source_amount = "";
                    this.invalid_amt = "INVALID AMOUNT!";
                    setTimeout(function () {
                        myObject.invalid_amt = "";
                    }, this.error_time_out);
                } else {
                    this.invalid_amt = "";
                }
            }
        },
    },
});


// window.addEventListener('load', function(){
// 	preloader.style.display = 'none';
// 	})
document.addEventListener("mousemove", function (e) {
    let left = e.offsetX;
    let top = e.offsetY;
    let tooltip = document.getElementById("xmr_tool_tip");
    if (tooltip !== null) {
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }
    tooltip = document.getElementById("xvg_tool_tip");
    if (tooltip !== null) {
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }
    tooltip = document.getElementById("eth_tool_tip");
    if (tooltip !== null) {
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }
    tooltip = document.getElementById("usdt_tool_tip");
    if (tooltip !== null) {
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }
    tooltip = document.getElementById("wbtc_tool_tip");
    if (tooltip !== null) {
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }
    tooltip = document.getElementById("yfi_tool_tip");
    if (tooltip !== null) {
        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
    }
});

async function get_old_order() {
    let deposit_address = $("#deposit_address").val();
    if (deposit_address === "") return;
    if (myObject.is_loading === 1) return;
    myObject.source_address = "";
    myObject.input_show = false;
    myObject.out_tx_list = [];
    myObject.split_out_tx_list = [];
    myObject.is_loading = 1;
    myObject.exceed = false;
    myObject.underpay = false;
    myObject.mini_pay = false;
    myObject.timed_out = false;
    myObject.received_flag = false;
    myObject.page_no_out_tx = 0;
    clearInterval(myObject.interval_fetch_data);
    myObject.status = 0;
    myObject.is_loaded = false;
    myObject.is_rated = false;
    let orders = await myObject.get_order_result(deposit_address);
    document.getElementById("deposit_address").value = "";
    myObject.out_tx_list = [];
    myObject.split_out_tx_list = [];
    if (orders === null || orders.data.length <= 0) {
        myObject.is_loading = -1;
        return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    myObject.is_loaded = true;
    let order = orders.data[0];
    myObject.order_type = order.order_type;
    myObject.calc_ex_price_max_btc();
    myObject.source_address = deposit_address;
    myObject.source_cur = order.source_coin;
    myObject.dest_cur = order.dest_coin;
    myObject.dest_currency = get_currency(order.dest_coin);
    myObject.source_currency = get_currency(order.source_coin);
    myObject.dest_tx_url = get_tx_url(order.dest_coin);
    myObject.source_tx_url = get_tx_url(order.source_coin);
    myObject.source_icon_path = get_icon_path(order.source_coin);
    myObject.dest_icon_path = get_icon_path(order.dest_coin);
    myObject.ex_real_price = order.ex_price;
    myObject.btc_miner_fee = order.btc_miner_fee;
    myObject.gas_reduce = order.gas_reduce;
    myObject.source_amount = order.src_amt;
    myObject.timeout = parseInt(order.rest_second) * 1000;
    myObject.details = order.details;
    myObject.exceed = order.exceed;
    myObject.underpay = order.underpay;
    myObject.lack = truncateDecimals(parseFloat(order.lack), myObject.price_decimal + 1);
    myObject.received = truncateDecimals(parseFloat(order.received), myObject.price_decimal);
    myObject.dst_amt = truncateDecimals(parseFloat(order.dst_amt), myObject.dest_decimals);
    myObject.interval_fetch_data();
    /*if (order.status === "canceled" || order.rest_second < 0) {*/
    if (order.status === "canceled") {
        myObject.timed_out = true;
        myObject.status = 1;
        myObject.qr_text = 'timed out';
        myObject.ribbon = "/static/img/expired_ribbon.png";
        myObject.timeout = 100;
        return;
    }
    if (order.status === "completed") {
        myObject.timed_out = false;
        myObject.received_flag = true;
        myObject.status = 2;
        myObject.qr_text = 'timed out';
        myObject.ex_price = truncateDecimals(myObject.ex_real_price, myObject.price_decimal);
        return;
    }
    if (order.status === "created") {
        myObject.timed_out = false;
        if (order.out_tx_list.length <= 0) {
            myObject.status = 1;
        } else {
            myObject.status = 2;
            myObject.received_flag = true;
        }
        if (myObject.source_cur === "BTC") {
            myObject.qr_source = "bitcoin";
            myObject.ex_price = myObject.calc_receive_amount(1);
        } else {
            myObject.ex_price = truncateDecimals((myObject.min_balance * 100) / myObject.calc_receive_amount(myObject.min_balance * 100), myObject.price_decimal);
        }
        if (myObject.source_cur === "XMR") {
            myObject.qr_source = "monero";
        } else {
            myObject.qr_source = "";
        }
        if (myObject.qr_source === "") {
            myObject.qr_text = myObject.source_address;
        } else {
            myObject.qr_text = myObject.qr_source + ":" + myObject.source_address + "?amount=" + myObject.source_amount.toString();
        }
    }
}


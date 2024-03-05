export const formatString = {
  getLastFirst: text => {
    if (!text) return
    const arrText = text.split(' ')
    if (arrText.length > 1) {
      return arrText[0].charAt(0) + arrText[arrText.length - 1].charAt(0)
    }
    return arrText[0].charAt(0)
  },
  formatPoint: price => {
    if (!price || price === 0) {
      return '0'
    } else {
      if (Number(price) < 1000) return 0
      return Number(price) / 1000
    }
  },
  formatVND: price => {
    if (!price || price === 0) {
      return '0'
    } else {
      return price.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    }
  },
  formatVNDPositive: price => {
    if (!price || price === 0) {
      return '0'
    } else {
      return Math.abs(price)
        .toFixed(0)
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    }
  },
  formatValueVoucher: price => {
    if (!price || price === 0) {
      return '0'
    } else if (Math.abs(price) <= 100) {
      return `${price}%`
    } else {
      return Math.abs(price)
        .toFixed(0)
        .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
    }
  },
  formatTypesProds: type => {
    const obj = {
      type: type,
      title: '',
      path: '',
      ID: ''
    }
    if (type === 'sp') {
      obj.title = 'sản phẩm'
      obj.ID = 794
    }
    if (type === 'nh') {
      obj.title = 'nhãn hàng'
      obj.ID = 4
    }
    return obj
  },
  formatTypeWallet: (item) => {
    if (item.Type === "NAP_QUY" && item.Source === "" && item.Value >= 0) {
      return "Hoa hồng"
    }
    else if (item.Type === "NAP_QUY" && item.Source === "" && item.Value < 0) {
      return "Rút tiền"
    }
    else {
      return item.Desc
    }
  }
}

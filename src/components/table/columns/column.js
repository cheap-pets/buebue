import isFunction from 'lodash.isfunction'

function widthValueValidator (v, allowUndefined) {
  return /^(auto|([1-9]\d*(px|%)))$/.test(v)
}

function alignValueValidator (v) {
  return ['left', 'center', 'right'].indexOf(v) !== -1
}

export default {
  name: 'MusselTableColumn',
  inject: ['table'],
  template: '<div></div>',
  props: {
    field: String,
    fixed: String,
    label: String,
    flex: {
      type: String,
      default: '1 0 auto'
    },
    width: {
      type: String,
      validator: widthValueValidator
    },
    headAlign: {
      type: String,
      validator: alignValueValidator
    },
    cellAlign: {
      type: String,
      default: 'center',
      validator: alignValueValidator
    },
    cellHtml: null,
    cellText: null,
    cellClass: null,
    cellStyle: null
  },
  computed: {
    columnWidth () {
      return (
        (this.fixed === undefined || this.width !== 'auto') &&
        widthValueValidator(this.width)
      )
        ? this.width
        : '100px'
    },
    headComponent () {
      return this.$options.headComponent
    },
    cellComponent () {
      return this.$options.cellComponent
    },
    editComponent () {
      return this.$options.editComponent
    }
  },
  created () {
    this.registerColumn()
  },
  beforeDestroy () {
    this.table.unregisterColumn(this._uid)
  },
  methods: {
    getComponentParams (record) {
      return {
        value: record[this.field]
      }
    },
    registerColumn () {
      this.table.registerColumn(this)
    },
    getCellText (record) {
      return this.cellText
        ? (
            isFunction(this.cellText) ? this.cellText(record) : this.cellText
          )
        : record[this.field]
    },
    getCellStyle (record) {
      return isFunction(this.cellStyle)
        ? this.cellStyle(record)
        : this.cellStyle
    },
    getCellClass (record) {
      const result = ['mu-table_cell']

      if (this.$options.cellClass) result.push(this.$options.cellClass)

      const extraClass = isFunction(this.cellClass)
        ? this.cellClass(record)
        : this.cellClass
      if (extraClass) result.push(extraClass)

      return result
    },
    onCellClick (record, column) {
      this.$emit('cellclick', record)
    }
  }
}

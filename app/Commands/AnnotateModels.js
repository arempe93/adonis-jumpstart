'use strict'

const { Command } = require('@adonisjs/ace')
const path = require('path')
const requireAll = require('require-all')

const Database = use('Database')

const SCHEMA_REGEX = /^('use strict'[\n]*)(\/\*[\s\S]*\*\/\n\n)?([\s\S]*)?/gm

class AnnotateModels extends Command {
  static get signature () {
    return 'annotate'
  }

  static get description () {
    return 'Add schema annotation comment to all models'
  }

  async _ensureInProjectRoot () {
    const exists = await this.pathExists(path.join(process.cwd(), 'ace'))
    if (!exists) {
      throw new Error('Make sure you are inside the project root before running annotate')
    }
  }

  _getModels () {
    const models = requireAll({
      dirname: `${process.cwd()}/app/Models/`,
      recursive: false
    })

    const tables = {}
    Object.keys(models).forEach((key) => {
      const model = models[key]
      tables[model.table] = `app/Models/${key}`
    })

    return tables
  }

  async _getColumnsByTable () {
    const rows = await Database
      .select('table_name', 'column_name', 'column_default', 'is_nullable', 'column_type', 'column_key', 'extra')
      .from('information_schema.columns')
      .where({ table_schema: 'adonis' })
      .whereNot({ table_name: 'adonis_schema' })
      .orderByRaw('table_name, ordinal_position')

    const columns = {}
    rows.forEach((row) => {
      let table = columns[row.table_name]
      if (!table) {
        table = columns[row.table_name] = []
      }

      table.push({
        defaultVal: row.column_default,
        extra: row.extra,
        name: row.column_name,
        nonNullable: row.is_nullable === 'NO',
        primaryKey: row.column_key === 'PRI',
        type: row.column_type,
      })
    })

    return columns
  }

  async _getIndicesByTable () {
    const rows = await Database
      .select('table_name', 'index_name', 'column_name', 'non_unique')
      .from('information_schema.statistics')
      .where({ table_schema: 'adonis' })
      .whereNot({ table_name: 'adonis_schema', index_name: 'PRIMARY' })
      .orderByRaw('table_name, index_name, seq_in_index')

    const indices = {}
    rows.forEach((row) => {
      let table = indices[row.table_name]
      if (!table) {
        table = indices[row.table_name] = {}
      }

      let index = table[row.index_name]
      if (!index) {
        index = table[row.index_name] = {}
      }

      if (!index.columns) {
        index.columns = []
      }

      index.unique = row.non_unique === 0
      index.columns.push(row.column_name)
    })

    return indices
  }

  async handle (args, options) {
    await this._ensureInProjectRoot()

    const columns = await this._getColumnsByTable()
    const indices = await this._getIndicesByTable()
    const models = this._getModels()

    Object.keys(models).forEach(async (table) => {
      const filename = `${process.cwd()}/${models[table]}.js`
      const buffer = await this.readFile(filename)
      const contents = buffer.toString()

      const rows = []
      let maxNameLength = 0
      let maxTypeLength = 0

      columns[table].forEach(({ name, type }) => {
        if (name.length > maxNameLength) {
          maxNameLength = name.length
        }

        if (type.length > maxTypeLength) {
          maxTypeLength = type.length
        }
      })

      const spaceBuffer = (max) => (string, extra = 2) => ' '.repeat(max - string.length + extra)
      const nameBuffer = spaceBuffer(maxNameLength)
      const typeBuffer = spaceBuffer(maxTypeLength)

      columns[table].forEach(({ defaultVal, extra, name, nonNullable, primaryKey, type }) => {
        let row = `|  ${name}${nameBuffer(name)}`
        row = `${row}${type}`

        const attrs = []
        if (defaultVal) {
          attrs.push(`default(${defaultVal})`)
        }

        if (nonNullable) {
          attrs.push('non-null')
        }

        if (primaryKey) {
          attrs.push('primary-key')
        }

        if (extra) {
          attrs.push(extra)
        }

        if (attrs.length > 0) {
          row = `${row}${typeBuffer(type)}${attrs.join(', ')}`
        }

        rows.push(row)
      })

      const indexKeys = Object.keys(indices[table])

      if (indexKeys.length > 0) {
        rows.push('|')
        rows.push('|  Indexes')
        rows.push('|')

        indexKeys.forEach((key) => {
          const val = indices[table][key]
          let row = `|  ${key} (${val.columns.join(', ')})`

          if (val.unique) {
            row = `${row}  UNIQUE`
          }

          rows.push(row)
        })
      }

      const schema = `/*
|--------------------------------------------------------------------------
|  Schema: ${table}
|--------------------------------------------------------------------------
${rows.join("\n")}
|
*/
\n`

      const updated = contents.replace(SCHEMA_REGEX, `$1${schema}$3`)

      if (updated !== contents) {
        await this.writeFile(filename, updated)
        this.success(`${this.icon('success')} updated: ${filename}`)
      }
    })

    Database.close()
  }
}

module.exports = AnnotateModels

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.text('description').notNullable()
      table.float('price').notNullable()
      table.integer('quantity').notNullable()
      table.boolean('is_deleted').defaultTo(false)
      table.string('thmbnail', 255)
      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('CASCADE')
      table
        .integer('collection_id')
        .unsigned()
        .references('id')
        .inTable('collections')
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

import assert                  from 'node:assert/strict'
import { describe }            from 'node:test'
import { it }                  from 'node:test'

import { ConfigModule }        from '@nestjs/config'
import { ConfigService }       from '@nestjs/config'
import { Test }                from '@nestjs/testing'

import { ConfigAdapterModule } from './config-adapter.module.js'

describe('Ingredients ConfigAdapterModule', () => {
  it('should initialize all providers correctly', async () => {
    const testingModule = await Test.createTestingModule({
      imports: [ConfigAdapterModule.register()],
    }).compile()

    assert.ok(testingModule.get(ConfigModule), 'ConfigModule should be provided')
    assert.ok(testingModule.get(ConfigService), 'ConfigService should be provided')
  })
})

/**
 * Configuration system for Zero library
 * 
 * Provides centralized configuration management with:
 * - Default configuration settings
 * - Environment variable overrides
 * - User configuration loading and validation
 * - Schema-based configuration validation
 */

export * from './ZeroConfig';
export * from './ConfigProvider';
export * from './EnvironmentResolver';
export * from './adapters/FileConfigAdapter';
export * from './adapters/JsonConfigAdapter';
export * from './models/IZeroConfigModel';
export * from './validators/ConfigValidator';
export * from './validators/ValidationResult';
export * from './validators/ValidationError';
export * from './schema/ConfigSchema';
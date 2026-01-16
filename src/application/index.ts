/**
 * Camada Application - Casos de Uso e Serviços de Aplicação
 * 
 * Esta camada implementa Clean Architecture e contém:
 * 
 * - DTOs: Data Transfer Objects para entrada/saída
 * - Use Cases: Casos de uso específicos (Single Responsibility)
 * - Services: Serviços de aplicação que orquestram casos de uso
 * - Factories: Factories para criação e injeção de dependências
 * 
 * Princípios aplicados:
 * - Single Responsibility Principle (SRP)
 * - Dependency Inversion Principle (DIP)
 * - Separation of Concerns
 */
export * from './dto';
export * from './usecases';
export * from './services';
export * from './factories/ApplicationServiceFactory';

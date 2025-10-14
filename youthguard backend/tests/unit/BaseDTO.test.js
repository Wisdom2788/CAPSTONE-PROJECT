/**
 * BaseDTO Unit Tests - YouthGuard Platform
 * 
 * These tests verify the functionality of the BaseDTO class.
 */

const BaseDTO = require('../../src/dto/BaseDTO');

describe('BaseDTO', () => {
    describe('constructor', () => {
        it('should create a BaseDTO instance with empty data', () => {
            const dto = new BaseDTO();
            expect(dto).toBeInstanceOf(BaseDTO);
            expect(dto.size()).toBe(0);
        });
        
        it('should create a BaseDTO instance with initial data', () => {
            const data = { name: 'John', age: 30 };
            const dto = new BaseDTO(data);
            expect(dto).toBeInstanceOf(BaseDTO);
            expect(dto.size()).toBe(2);
            expect(dto.get('name')).toBe('John');
            expect(dto.get('age')).toBe(30);
        });
    });
    
    describe('get', () => {
        it('should get data value by key', () => {
            const data = { name: 'John', age: 30 };
            const dto = new BaseDTO(data);
            expect(dto.get('name')).toBe('John');
            expect(dto.get('age')).toBe(30);
        });
        
        it('should return undefined for non-existent key', () => {
            const dto = new BaseDTO();
            expect(dto.get('nonExistent')).toBeUndefined();
        });
    });
    
    describe('set', () => {
        it('should set data value by key', () => {
            const dto = new BaseDTO();
            dto.set('name', 'John');
            dto.set('age', 30);
            expect(dto.get('name')).toBe('John');
            expect(dto.get('age')).toBe(30);
        });
        
        it('should update existing key value', () => {
            const dto = new BaseDTO({ name: 'John' });
            expect(dto.get('name')).toBe('John');
            dto.set('name', 'Jane');
            expect(dto.get('name')).toBe('Jane');
        });
    });
    
    describe('has', () => {
        it('should return true for existing key', () => {
            const dto = new BaseDTO({ name: 'John' });
            expect(dto.has('name')).toBe(true);
        });
        
        it('should return false for non-existent key', () => {
            const dto = new BaseDTO();
            expect(dto.has('name')).toBe(false);
        });
    });
    
    describe('remove', () => {
        it('should remove key from data', () => {
            const dto = new BaseDTO({ name: 'John', age: 30 });
            expect(dto.size()).toBe(2);
            dto.remove('name');
            expect(dto.size()).toBe(1);
            expect(dto.has('name')).toBe(false);
            expect(dto.has('age')).toBe(true);
        });
        
        it('should not throw error when removing non-existent key', () => {
            const dto = new BaseDTO();
            expect(() => dto.remove('nonExistent')).not.toThrow();
        });
    });
    
    describe('keys', () => {
        it('should return all data keys', () => {
            const dto = new BaseDTO({ name: 'John', age: 30, city: 'Lagos' });
            const keys = dto.keys();
            expect(keys).toEqual(['name', 'age', 'city']);
        });
        
        it('should return empty array for empty DTO', () => {
            const dto = new BaseDTO();
            const keys = dto.keys();
            expect(keys).toEqual([]);
        });
    });
    
    describe('size', () => {
        it('should return correct data size', () => {
            const dto = new BaseDTO({ name: 'John', age: 30, city: 'Lagos' });
            expect(dto.size()).toBe(3);
        });
        
        it('should return 0 for empty DTO', () => {
            const dto = new BaseDTO();
            expect(dto.size()).toBe(0);
        });
    });
    
    describe('clear', () => {
        it('should clear all data', () => {
            const dto = new BaseDTO({ name: 'John', age: 30 });
            expect(dto.size()).toBe(2);
            dto.clear();
            expect(dto.size()).toBe(0);
            expect(dto.isEmpty()).toBe(true);
        });
    });
    
    describe('isEmpty', () => {
        it('should return true for empty DTO', () => {
            const dto = new BaseDTO();
            expect(dto.isEmpty()).toBe(true);
        });
        
        it('should return false for non-empty DTO', () => {
            const dto = new BaseDTO({ name: 'John' });
            expect(dto.isEmpty()).toBe(false);
        });
    });
    
    describe('toObject', () => {
        it('should return plain object representation', () => {
            const data = { name: 'John', age: 30 };
            const dto = new BaseDTO(data);
            const obj = dto.toObject();
            expect(obj).toEqual(data);
            expect(obj).not.toBe(data); // Should be a copy
        });
        
        it('should return empty object for empty DTO', () => {
            const dto = new BaseDTO();
            const obj = dto.toObject();
            expect(obj).toEqual({});
        });
    });
    
    describe('toJSON', () => {
        it('should return JSON string representation', () => {
            const data = { name: 'John', age: 30 };
            const dto = new BaseDTO(data);
            const json = dto.toJSON();
            expect(json).toBe(JSON.stringify(data));
        });
    });
});
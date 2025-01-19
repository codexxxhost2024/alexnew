import { Logger } from '../utils/logger.js';
import { ApplicationError, ErrorCodes } from '../utils/error-boundary.js';
import { GoogleSearchTool } from './google-search.js';
import { WeatherTool } from './weather-tool.js';
import { DocumentSaverTool } from './document-saver.js';
import { EmailSenderTool } from './email-sender.js';
import { CalculatorTool } from './calculator.js';
import { UnitConverterTool } from './unit-converter.js';
import { TimeConverterTool } from './time-converter.js';
import { CurrencyConverterTool } from './currency-converter.js';
import { DateCalculatorTool } from './date-calculator.js';
import { TextSummarizerTool } from './text-summarizer.js';
import { TextTranslatorTool } from './text-translator.js';
import { RandomGeneratorTool } from './random-generator.js';
import { PasswordGeneratorTool } from './password-generator.js';
import { ListGeneratorTool } from './list-generator.js';

/**
 * Manages the registration and execution of tools.
 * Tools are used to extend the functionality of the Gemini API, allowing it to interact with external services.
 */
export class ToolManager {
    /**
     * Creates a new ToolManager and registers default tools.
     */
    constructor() {
        this.tools = new Map();
        this.registerDefaultTools();
    }

    /**
     * Registers the default tools: GoogleSearchTool and WeatherTool.
     */
    registerDefaultTools() {
        this.registerTool('googleSearch', new GoogleSearchTool());
        this.registerTool('weather', new WeatherTool());
        this.registerTool('documentSaver', new DocumentSaverTool());
        this.registerTool('emailSender', new EmailSenderTool());
        this.registerTool('calculator', new CalculatorTool());
        this.registerTool('unitConverter', new UnitConverterTool());
        this.registerTool('timeConverter', new TimeConverterTool());
        this.registerTool('currencyConverter', new CurrencyConverterTool());
        this.registerTool('dateCalculator', new DateCalculatorTool());
        this.registerTool('textSummarizer', new TextSummarizerTool());
        this.registerTool('textTranslator', new TextTranslatorTool());
        this.registerTool('randomGenerator', new RandomGeneratorTool());
        this.registerTool('passwordGenerator', new PasswordGeneratorTool());
        this.registerTool('listGenerator', new ListGeneratorTool());
    }

    /**
     * Registers a new tool.
     * 
     * @param {string} name - The name of the tool.
     * @param {Object} toolInstance - The tool instance. Must have a `getDeclaration` method.
     * @throws {ApplicationError} Throws an error if a tool with the same name is already registered.
     */
    registerTool(name, toolInstance) {
        if (this.tools.has(name)) {
            throw new ApplicationError(
                `Tool ${name} is already registered`,
                ErrorCodes.INVALID_STATE
            );
        }
        this.tools.set(name, toolInstance);
        Logger.info(`Tool ${name} registered successfully`);
    }

    /**
     * Returns the tool declarations for all registered tools.
     * These declarations are used by the Gemini API to understand what tools are available.
     *
     * @returns {Object[]} An array of tool declarations.
     */
    getToolDeclarations() {
        const allDeclarations = [];

        this.tools.forEach((tool, name) => {
            if (tool.getDeclaration) {
                if (name === 'weather') {
                    allDeclarations.push({
                        functionDeclarations: tool.getDeclaration()
                    });
                } else {
                    allDeclarations.push({ [name]: tool.getDeclaration() });
                }
            }
        });

        return allDeclarations;
    }

    /**
     * Handles a tool call from the Gemini API.
     * Executes the specified tool with the given arguments.
     *
     * @param {Object} functionCall - The function call object from the Gemini API.
     * @param {string} functionCall.name - The name of the tool to execute.
     * @param {Object} functionCall.args - The arguments to pass to the tool.
     * @param {string} functionCall.id - The ID of the function call.
     * @returns {Promise<Object>} A promise that resolves with the tool's response.
     * @throws {ApplicationError} Throws an error if the tool is unknown or if the tool execution fails.
     */
    async handleToolCall(functionCall) {
        const { name, args, id } = functionCall;
        Logger.info(`Handling tool call: ${name}`, { args });

        let tool;
        if (name === 'get_weather_on_date') {
            tool = this.tools.get('weather');
        } else {
            tool = this.tools.get(name);
        }

        if (!tool) {
            throw new ApplicationError(
                `Unknown tool: ${name}`,
                ErrorCodes.INVALID_PARAMETER
            );
        }

        try {
            const result = await tool.execute(args);
            return {
                functionResponses: [{
                    response: { output: result },
                    id
                }]
            };
        } catch (error) {
            Logger.error(`Tool execution failed: ${name}`, error);
            return {
                functionResponses: [{
                    response: { error: error.message },
                    id
                }]
            };
        }
    }
}
import 'jest';
import { CommandNotFoundError } from '../../parser/CommandNotFoundError';
import { ExtraneousParamError } from '../../parser/ExtraneousParamError';
import { MalformedOptionError } from '../../parser/MalformedOptionError';
import { MissingCommandError } from '../../parser/MissingCommandError';
import { Parser } from '../../parser/Parser';
import { UnknownOptionError } from '../../parser/UnknownOptionError';
import { ManifestDefinition } from '../../types/manifest';
import * as sampleManifest from '../sample-cli/oo-cli.manifest.json';

const manifest: ManifestDefinition = sampleManifest as any;
const statusCommand = manifest.commands.find((c) => c.command === 'status')!;
const scheduleCommand = manifest.commands.find((c) => c.command === 'schedule')!;

describe('Parser', () => {
  describe('parse', () => {
    it('parses a command not in a namespace', () => {
      const parser = new Parser(manifest);
      parser.parse(['status', '-ld', 'porch light', 'front door']);
      expect(parser.commandConfig).toEqual({
        lights: 'true',
        doors: 'true',
        devices: ['porch light', 'front door']
      });
    });

    it('parses a command in a namespace', () => {
      const parser = new Parser(manifest);
      parser.parse(['garage', 'workshop', 'power', 'up']);
      expect(parser.commandConfig).toEqual({
        action: 'up'
      });
    });
  });

  describe('parseOutNamespace', () => {
    it('determines the namespace from the args', () => {
      const parser = new Parser(manifest);
      parser['parseOutNamespace'](['garage', 'workshop', 'power', 'on']);
      expect(parser.namespace).toEqual(['garage', 'workshop']);
    });

    it('is case sensitive', () => {
      const parser = new Parser(manifest);
      parser['parseOutNamespace'](['Garage', 'Workshop', 'power', 'on']);
      expect(parser.namespace).toEqual([]);
    });

    it('removes the namespace from the args', () => {
      const parser = new Parser(manifest);
      const args = ['garage', 'workshop', 'power', 'on'];
      parser['parseOutNamespace'](args);
      expect(args).toEqual(['power', 'on']);
    });
  });

  describe('getCommand', () => {
    it('finds the command by name', () => {
      const parser = new Parser(manifest);
      const command = parser['getCommand']('schedule');
      expect(command.command).toEqual('schedule');
    });

    it('finds the command by alias', () => {
      const parser = new Parser(manifest);
      const command = parser['getCommand']('s');
      expect(command.command).toEqual('schedule');
    });

    it('throws an error for a missing command', () => {
      const parser = new Parser(manifest);
      expect(() => parser['getCommand'](undefined)).toThrowError(MissingCommandError);
    });

    it('throws an error for an invalid command', () => {
      const parser = new Parser(manifest);
      expect(() => parser['getCommand']('--foobar')).toThrowError(CommandNotFoundError);
    });

    it('throws an error when the command is not found', () => {
      const parser = new Parser(manifest);
      expect(() => parser['getCommand']('unknown')).toThrowError(CommandNotFoundError);
    });
  });

  describe('parseArgs', () => {
    let parser!: Parser;
    beforeEach(() => {
      parser = new Parser(manifest);
    });

    it('parses flags', () => {
      parser['parseArgs'](statusCommand, ['--verbose', '-l']);
      expect(parser.commandConfig).toEqual({verbose: 'true', lights: 'true'});
    });

    it('parses multiple single character flags together', () => {
      parser['parseArgs'](statusCommand, ['-vLd']);
      expect(parser.commandConfig).toEqual({verbose: 'true', lights: 'false', doors: 'true'});
    });

    it('parses the value for an option', () => {
      parser['parseArgs'](scheduleCommand, ['--floor=main']);
      expect(parser.commandConfig).toEqual({floor: 'main'});
    });

    it('parses the value for an option alias', () => {
      parser['parseArgs'](scheduleCommand, ['-f=main']);
      expect(parser.commandConfig).toEqual({floor: 'main'});
    });

    it('parses values for options allowing multiple values', () => {
      parser['parseArgs'](scheduleCommand, ['--name=kitchen lamp', '-n=porch light']);
      expect(parser.commandConfig).toEqual({name: ['kitchen lamp', 'porch light']});
    });

    it('parses values for options allowing multiple values', () => {
      parser['parseArgs'](scheduleCommand, ['--name=kitchen lamp', '-n=porch light']);
      expect(parser.commandConfig).toEqual({name: ['kitchen lamp', 'porch light']});
    });

    it('throws an error for an unknown option', () => {
      expect(() => parser['parseArgs'](scheduleCommand, ['--foo'])).toThrowError(UnknownOptionError);
    });

    it('parses a multi-parameter', () => {
      parser['parseArgs'](statusCommand, ['kitchen lamp', 'porch light']);
      expect(parser.commandConfig).toEqual({devices: ['kitchen lamp', 'porch light']});
    });

    it('parses parameters after flags', () => {
      parser['parseArgs'](statusCommand, ['-v', 'kitchen lamp']);
      expect(parser.commandConfig).toEqual({verbose: 'true', devices: ['kitchen lamp']});
    });

    it('throws an error when parameters are split up by flags/options', () => {
      expect(
        () => parser['parseArgs'](statusCommand, ['kitchen lamp', '-v', 'porch light'])
      ).toThrowError(ExtraneousParamError);
    });

    it('parses params after a separator even if they look like flags', () => {
      parser['parseArgs'](statusCommand, ['-l', '--', 'kitchen lamp', '-v', 'porch light']);
      expect(parser.commandConfig).toEqual({
        lights: 'true',
        devices: ['kitchen lamp', '-v', 'porch light']
      });
    });

    it('throws an error when options are malformed', () => {
      expect(() => parser['parseArgs'](statusCommand, ['-v-malformed'])).toThrowError(MalformedOptionError);
    });
  });

  describe('parseFlagsOrOptions', () => {
    const parser: Parser = new Parser(manifest);

    it('parses -a', () => {
      expect(parser['parseFlagsOrOption']('-a')).toEqual([{name: 'a'}]);
    });

    it('parses -abc', () => {
      expect(parser['parseFlagsOrOption']('-abc')).toEqual([{name: 'a'}, {name: 'b'}, {name: 'c'}]);
    });

    it('parses --abc', () => {
      expect(parser['parseFlagsOrOption']('--abc')).toEqual([{name: 'abc'}]);
    });

    it('parses --a=Alpha', () => {
      expect(parser['parseFlagsOrOption']('-a=Alpha')).toEqual([{name: 'a', value: 'Alpha'}]);
    });

    it('parses -a=Alpha', () => {
      expect(parser['parseFlagsOrOption']('-a=Alpha')).toEqual([{name: 'a', value: 'Alpha'}]);
    });

    it('parses --abc=ABCs', () => {
      expect(parser['parseFlagsOrOption']('-a=ABCs')).toEqual([{name: 'a', value: 'ABCs'}]);
    });
  });

  describe('findFlag', () => {
    const parser: Parser = new Parser(manifest);

    it('finds a flag by name', () => {
      const result = parser['findFlag']('verbose', statusCommand.flags);
      expect(result.flag!.name).toEqual('verbose');
      expect(result.inverted).toBeFalsy();
    });

    it('finds a flag by alias', () => {
      const result = parser['findFlag']('v', statusCommand.flags);
      expect(result.inverted).toBeFalsy();
      expect(result.flag!.name).toEqual('verbose');
    });

    it('finds an invertible flag', () => {
      const result = parser['findFlag']('l', statusCommand.flags);
      expect(result.flag!.name).toEqual('lights');
      expect(result.inverted).toBeFalsy();
    });

    it('finds an inverted flag by name', () => {
      const result = parser['findFlag']('no-lights', statusCommand.flags);
      expect(result.flag!.name).toEqual('lights');
      expect(result.inverted).toBeTruthy();
    });

    it('finds an inverted flag by alias', () => {
      const result = parser['findFlag']('L', statusCommand.flags);
      expect(result.flag!.name).toEqual('lights');
      expect(result.inverted).toBeTruthy();
    });

    it('returns undefined when it cannot find the flag', () => {
      const result = parser['findFlag']('unknown', statusCommand.flags);
      expect(result.flag).toBeUndefined();
    });
  });

  describe('findOption', () => {
    const parser: Parser = new Parser(manifest);

    it('finds an option by name', () => {
      const option = parser['findOption']('floor', scheduleCommand.options);
      expect(option!.name).toEqual('floor');
    });

    it('finds an option by alias', () => {
      const option = parser['findOption']('f', scheduleCommand.options);
      expect(option!.name).toEqual('floor');
    });

    it('returns undefined when it cannot find the option', () => {
      const result = parser['findOption']('unknown', scheduleCommand.options);
      expect(result).toBeUndefined();
    });
  });
});

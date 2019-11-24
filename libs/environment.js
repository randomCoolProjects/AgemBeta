var sysConfig = JSON.parse(LocalResourceCache.GetResource('data/sysvar.json'));

const Sys = {

    GetScript: function(script)
    {
        try
        {
        return eval(script.substring(1));
        }
        catch{
            return '';
        }
    },

    GetVar: function(varname)
    {
        while(varname.includes('%')) varname = varname.replace('%','');
        var data = sysConfig[varname];
        if(!data) return null;
        return Sys.Parse(data);
        if (data[0] == '$')
        return this.GetScript(data);
        if (data[0] == '%' && data[data.length-1] == '%')
        return this.GetVar(data, `GetVar {${varname} = ${data}}`);
        return data;
    },

    Parse: function(cmd)
    {
        if (!cmd) return cmd;
        if (cmd[0] == '$') return this.GetScript(cmd);
        var keys = Object.keys(sysConfig);
        var result = cmd;
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var fullStr = '%'+key+'%';
            while(result.includes(fullStr))
            result = result.replace(fullStr, this.GetVar(fullStr));
        }
        return result;
    }

}
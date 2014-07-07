using System.Collections.Generic;
using System.Linq;
using Delsys.Ada.Business.Common.Adapters;
using Delsys.Ada.Business.Common.Adapters.Articulos;
using Delsys.Ada.Business.Core.Base;
using Delsys.Ada.Web.Core.Services;
using ServiceStack.ServiceHost;
using ServiceStack.ServiceInterface;

namespace AdaWebFrameworkSeed.WebServices
{
    /// <summary>
    /// La ruta per defecte és: 
    /// http://localhost:50667/json/reply/Pastas
    /// o 
    /// http://localhost:50667/html/reply/Pastas
    /// <see cref="https://github.com/ServiceStack/ServiceStack/wiki/Routing"/>
    /// Per la documentació d'utilitza swagger: 
    /// https://github.com/ServiceStack/ServiceStack/wiki/Swagger-API
    /// </summary>
    [Route("/Portal/Pastas", "GET", Summary = @"GET Obte tots els articles.", Notes = "Això és un exemple d'anotació per aquest servei.")]
    [Authenticate] //=> Indica que hem d'estar "authenticats".
    public class PortalPastas : IReturn<List<Articulo>>
    {
    }

    public class SampleService : WebServiceBase
    {
        public object Get(PortalPastas dto)
        {
            return Services.BusinessServices.Common.Articulos().Where( a => a.Description != null && a.Description.Contains("PASTA")).ToList();
        }
        //TODO: Post 
    }
}
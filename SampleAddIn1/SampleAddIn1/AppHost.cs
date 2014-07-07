using Delsys.Ada.Web.Core;
using SampleAddIn1;
using ServiceStack.Api.Swagger;

[assembly: WebActivator.PreApplicationStartMethod(typeof(AppHost), "Start")]

namespace SampleAddIn1
{
    public class AppHost
		: AppHostCore
	{		
		public AppHost() //Tell ServiceStack the name and where to find your web services
            : base(typeof(AppHost).Assembly) { }

        public override void Configure(Funq.Container container)
        {
            base.Configure(container);
            Plugins.Add(new SwaggerFeature());
        }

		public static void Start()
		{
			new AppHost().Init();
		}
	}
}

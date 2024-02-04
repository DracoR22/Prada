import { db } from "@/lib/db"
import { Contact, SubAccount, Ticket } from "@prisma/client"

interface Props {
    params: { subaccountId: string }
}

const ContactsPage = async ({ params }: Props) => {

    type SubAccountWithContacts = SubAccount & { Contact: (Contact & { Ticket: Ticket[] })[] }
    
      const contacts = (await db.subAccount.findUnique({
        where: {
          id: params.subaccountId,
        },
    
        include: {
          Contact: {
            include: {
              Ticket: {
                select: {
                  value: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      })) as SubAccountWithContacts
    
      const allContacts = contacts.Contact

    return (
        <div>
            
        </div>
    )
}

export default ContactsPage
